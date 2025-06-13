import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

function App() {
  const [qrSrc, setQrSrc] = useState('')
  const [status, setStatus] = useState('WAITING')

  useEffect(() => {
    socket.on('qr', async (qr) => {
      const qrImage = await QRCode.toDataURL(qr)
      setQrSrc(qrImage)
    })

    socket.on('status', (msg) => {
      setStatus(msg)
    })
  }, [])

  return (
    <div>
      <h1>Status: {status}</h1>
      {qrSrc && <img src={qrSrc} alt="Scan QR" />}
    </div>
  )
}

export default App
