import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import QRCode from 'qrcode'

function App() {
  const [qrDataURL, setQRDataURL] = useState('')
  const [status, setStatus] = useState('MENUNGGU QR...')

  useEffect(() => {
    window.electronAPI.onQR(async (qr) => {
      const dataUrl = await QRCode.toDataURL(qr)
      setQRDataURL(dataUrl)
    })
    window.electronAPI.onStatus((newStatus) => {
      setStatus(newStatus)
    })
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Status: {status}</h1>
      {qrDataURL && <img src={qrDataURL} alt="QR Code" />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
