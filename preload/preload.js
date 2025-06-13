import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  onQR: (callback) => ipcRenderer.on('qr', (_, data) => callback(data)),
  onStatus: (callback) => ipcRenderer.on('status', (_, data) => callback(data)),
})
