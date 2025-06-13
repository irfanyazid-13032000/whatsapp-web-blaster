import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import qrcode from 'qrcode';

export const startWhatsApp = async (setQR, onLogin) => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys'); // auto buat folder

  const sock = makeWASocket({
    browser: ['Ubuntu', 'Chrome', '113.0.5672.126'], // versi nyata Chrome
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async ({ connection, qr }) => {
    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      setQR(qrImage);
    }
    if (connection === 'open') {
      onLogin();
    }
  });
};
