import React from 'react'
import ContactList from '../components/ContactList'

const dummyContacts = [
  { name: 'Andi', phone: '+628123456789' },
  { name: 'Budi', phone: '+628987654321' },
  { name: 'Citra', phone: '+628111222333' },
]

function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Selamat Datang</h1>
      <p>Anda sudah login</p>
      <ContactList contacts={dummyContacts} />
    </div>
  )
}

export default Home
