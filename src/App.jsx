import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import QRCode from 'react-qr-code'



const socket = io('http://localhost:3000') // sesuaikan kalau beda port

function App() {
  const [qr, setQr] = useState(null)

  useEffect(() => {
    socket.on('qr', (qrString) => {
      setQr(qrString)
    })

    return () => socket.off('qr')
  }, [])

  return (
    <div style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Scan QR WhatsApp</h1>
      {qr ? (
        <QRCode value={qr} size={256} />
      ) : (
        <p>Menunggu QR code...</p>
      )}
    </div>
  )
}

export default App
