import { app, BrowserWindow,ipcMain } from 'electron'
import { startSocketServer } from './server.js'
import { start, getSock } from './baileys.js' // ⬅️ pastikan path sesuai


import path from 'path'
import { fileURLToPath } from 'url'

import * as contactStore from './contactStore.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  })

  if (app.isPackaged) {
  const indexPath = path.join(__dirname, '../dist/index.html')
  if (fs.existsSync(indexPath)) {
    win.loadURL(pathToFileURL(indexPath).toString())
  } else {
    console.error('❌ index.html not found:', indexPath)
  }
} else {
  win.loadURL('http://localhost:5173')
}
}

app.whenReady().then(() => {
  createWindow()
  startSocketServer()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


ipcMain.handle('get-contacts', () => {
  return contactStore.getContacts();
});

ipcMain.handle('save-contacts', (_, contacts) => {
  contactStore.saveContacts(contacts);
});

ipcMain.handle('send-message', async (event, { number, message }) => {
  const sock = getSock()
  if (!sock) {
    console.log('❌ Socket belum siap')
    return 'Socket not ready'
  }
  try {
    await sock.sendMessage(number, { text: message })
    return 'Message sent'
  } catch (err) {
    console.error('❌ Error sending message:', err)
    return 'Error sending message'
  }
})
