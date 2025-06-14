import React from 'react'

function ContactList({ contacts }) {
  return (
    <div>
      <h2>Daftar Kontak</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map((contact, index) => (
          <li key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
            <strong>{contact.name}</strong><br />
            {contact.phone}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContactList
