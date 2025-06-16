import { makeWASocket, DisconnectReason } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal' // ⬅️ ini WAJIB buat munculin QR kotaknya

import useSingleFileAuthState from './useSingleFileAuthState.js'
import { Boom } from '@hapi/boom'
// import waEvents  from '../src/lib/waEvents.js' // Import waEvents untuk event handling
import useSockStore from '../src/lib/sockStore.js' // ⬅️ sesuaikan path



// baileys.js

let sock = null;


export async function start(io) {
  try {
    const { state, saveState } = await useSingleFileAuthState('./auth_info.json')

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
    })

    sock.ev.on('creds.update', saveState)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        console.log('🔑 QR code:', qr)
        qrcode.generate(qr, { small: true }) // ⬅️ INI bikin muncul kotaknya di terminal
        io.emit('qr', qr)
      }

      if (connection === 'open') {
        console.log('✅ WhatsApp Connected!')
        io.emit('connected', true) // kirim event ke frontend
        // waEvents.emit('socket-ready', sock)
        useSockStore.getState().setSock(sock) // ⬅️ set di Zustand


      } else if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
        console.log('❌ Connection closed:', reason)

        if (reason !== DisconnectReason.loggedOut) {
          console.log('🔁 Reconnecting...')
          start(io)
        }
      }
    })
  } catch (err) {
    console.error('❌ Baileys Error:', err)
  }
}

export function getSock() {
  return sock
}


