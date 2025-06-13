const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const qrcode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
    }
  });

  mainWindow.loadURL('http://localhost:5173');
}

ipcMain.on('start-login', async () => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');

  const sock = makeWASocket({
    browser: ['Ubuntu', 'Chrome', '113.0.5672.126'], // versi nyata Chrome
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, qr }) => {
    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      mainWindow.webContents.send('qr', qrImage);
    }

    if (connection === 'open') {
      mainWindow.webContents.send('login-success');
      new Notification({ title: 'WhatsApp', body: 'Berhasil login WhatsApp!' }).show();
    }
  });
});

app.whenReady().then(createWindow);
