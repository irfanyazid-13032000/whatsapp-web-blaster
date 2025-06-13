const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startLogin: () => ipcRenderer.send('start-login'),
  onQR: (callback) => ipcRenderer.on('qr', (_, data) => callback(data)),
  onLoginSuccess: (callback) => ipcRenderer.on('login-success', () => callback()),
});
