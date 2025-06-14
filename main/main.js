import { app, BrowserWindow,ipcMain } from 'electron'
import { startSocketServer } from './server.js'

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

  win.loadURL('http://localhost:5173')
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
