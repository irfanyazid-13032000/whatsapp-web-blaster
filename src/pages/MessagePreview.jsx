import { useEffect, useState } from 'react';
import './../styles/MessagePreview.css';
import { Search, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Tambahkan ini
import { useNavigate } from 'react-router-dom';



export default function MessagePreview() {
  const location = useLocation(); // Gunakan useLocation
  const navigate = useNavigate(); // Add this
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const { message, repeat } = location.state || {};



  useEffect(() => {
    window.api.getContacts().then((data) => {
      const validArray = Array.isArray(data) ? data : [];
      setContacts(validArray);
      setFilteredContacts(validArray);
    });
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.number.includes(searchTerm)
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const handleSelect = (id, e) => {
  // Cek jika klik berasal dari checkbox langsung
  if (e && e.target.type === 'checkbox') {
    return; // Biarkan event checkbox menangani sendiri
  }
  
  setSelectedContacts((prev) =>
    prev.includes(id)
      ? prev.filter((contactId) => contactId !== id)
      : [...prev, id]
  );
};

 const handleSend = () => {
    const targets = contacts.filter((c) => selectedContacts.includes(c.id));
    navigate('/send-progress', {
      state: {
        message,
        repeat,
        selectedContacts: targets
      }
    });
  };

  return (
    <div className="contact-management">
      <h1>Preview Kontak untuk Blasting</h1>

       {/* Tambahkan ini untuk menampilkan pesan */}
      {message && (
        <div className="message-preview-box">
          <h3 style={{ backgroundColor:'#242526' }}>Pesan yang akan dikirim:</h3>
          <div className="message-content">{message}</div>
          <div className="repeat-info" style={{ backgroundColor:'#242526' }}>Akan dikirim {repeat} kali ke {selectedContacts.length} orang</div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari kontak..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <button className="action-button search-button">
          <Search size={20} style={{ backgroundColor:'#2374e1' }} />
        </button>
      </div>

      {/* Table */}
      <table className="contacts-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>#</th>
            <th style={{ textAlign: 'center' }}>Nama</th>
            <th style={{ textAlign: 'center' }}>Nomor</th>
            <th style={{ textAlign: 'center' }}>Pilih</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((c, i) => (
            <tr 
             key={c.id}
             style={{
                backgroundColor: selectedContacts.includes(c.id) 
                  ? 'rgba(184, 72, 89, 0.3)' 
                  : 'inherit'
              }}
              onClick={(e) => handleSelect(c.id, e)}
              className={selectedContacts.includes(c.id) ? 'selected-row' : ''}
            >
              <td style={{ textAlign: 'center' }}>{i + 1}</td>
              <td style={{ textAlign: 'center' }}>{c.name}</td>
              <td style={{ textAlign: 'center' }}>{c.number}</td>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(c.id)}
                  onChange={(e) => {
                     e.stopPropagation()// Menghentikan event bubbling
                    handleSelect(c.id)
                  }
                }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Send Button */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        {selectedContacts.length === 0 ? (
          <p style={{ color: 'red' }}>Tidak ada kontak yang dipilih!</p>
        ): <button
          onClick={handleSend}
          className="action-button add-button"
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          <Send size={15} style={{ marginRight: '8px',backgroundColor:'#2374e1' }} />
          Kirim Pesan
        </button>}
        
      </div>
    </div>
  );
}
