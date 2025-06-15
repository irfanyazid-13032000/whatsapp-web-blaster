import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import QRCode from 'react-qr-code'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ContactManagement from './pages/ContactManagement'
import SendMessage from './pages/SendMessage'
import MessagePreview from './pages/MessagePreview';
import SendProgress from './pages/SendProgress';

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
        <BrowserRouter>
             <Routes>
               <Route path="/" element={<Home />}>
                 <Route path="contact" element={<ContactManagement />} />
                 <Route path="send-message" element={<SendMessage />} />
                 <Route path="/preview" element={<MessagePreview />} />
                 <Route path="/send-progress" element={<SendProgress />} />
               </Route>
             </Routes>
           </BrowserRouter>
      ) : qr ? (
        <QRCode value={qr} size={256} />
      ) : (
        <p>Menunggu QR code...</p>
      )}
    </div>
  )
}

export default App
