import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ContactManagement from './pages/ContactManagement'
import SendMessage from './pages/SendMessage'
import MessagePreview from './pages/MessagePreview';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="contact" element={<ContactManagement />} />
          <Route path="send-message" element={<SendMessage />} />
          <Route path="/preview" element={<MessagePreview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
