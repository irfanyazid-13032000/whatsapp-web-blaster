import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import QRCode from 'react-qr-code'

const socket = io('http://localhost:3000')

function App() {
  const [qr, setQr] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('qr', (qrString) => {
      setQr(qrString)
      setConnected(false) // reset kalau QR baru muncul
    })

    socket.on('connected', () => {
      setConnected(true)
      setQr(null) // sembunyikan QR
    })

    return () => {
      socket.off('qr')
      socket.off('connected')
    }
  }, [])

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Scan QR WhatsApp</h1>
      {connected ? (
        <p style={{ fontSize: '24px', color: 'green' }}>✅ Anda berhasil login!</p>
      ) : qr ? (
        <QRCode value={qr} size={256} />
      ) : (
        <p>Menunggu QR code...</p>
      )}
    </div>
  )
}

export default App
