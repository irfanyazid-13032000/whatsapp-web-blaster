import { Server } from 'socket.io'
import { createServer } from 'http'
import { start } from './baileys.js'

export function startSocketServer() {
  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  httpServer.listen(3000, () => {
    console.log('📡 Socket.IO server running at http://localhost:3000')
  })

  // Start koneksi WhatsApp pakai socket
  start(io)
}
