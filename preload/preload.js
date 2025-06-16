const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('api', {
  getContacts: () => ipcRenderer.invoke('get-contacts'),
  saveContacts: (contacts) => ipcRenderer.invoke('save-contacts', contacts),
});


contextBridge.exposeInMainWorld('electronAPI', {
  onQR: (callback) => ipcRenderer.on('qr', (_, data) => callback(data)),
  onStatus: (callback) => ipcRenderer.on('status', (_, data) => callback(data)),
})

contextBridge.exposeInMainWorld('nodeAPI', {
  createBuffer: (data) => Buffer.from(data, 'base64'),
});

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args),
  }
})
