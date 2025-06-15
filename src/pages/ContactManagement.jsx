import { useState, useEffect } from 'react';
import './../styles/ContactManagement.css';
import { Search, Plus, Pencil, SquarePen, Trash2 } from 'lucide-react';


export default function ContactManagement() {
  const [isInitialized, setIsInitialized] = useState(false); // 🆕 Tambahkan flag
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', number: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.api.getContacts().then((data) => {
      setContacts(data);
       setIsInitialized(true); // 🟢 Baru aktifkan update setelah load awal selesai
    });
  }, []);

  useEffect(() => {
     if (isInitialized) {
    window.api.saveContacts(contacts);
  }
  }, [contacts,isInitialized]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.number.trim()) return;

    if (isEditing) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...formData } : c))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      const newId = Date.now().toString();
      setContacts([...contacts, { id: newId, ...formData }]);
    }

    setFormData({ name: '', number: '' });
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
    if (isEditing && id === editId) {
      setIsEditing(false);
      setEditId(null);
      setFormData({ name: '', number: '' });
    }
  };

  const handleEditClick = (contact) => {
    setIsEditing(true);
    setEditId(contact.id);
    setFormData({ name: contact.name, number: contact.number });
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.number.includes(searchTerm)
  );

  return (
    <div className="contact-management">
      <h1>Daftar Kontak</h1>
      {/* Form + Search + Table sama seperti sebelumnya */}
       {/* Form Tambah/Edit */}
      <form className="contact-form" onSubmit={handleAddContact}>
        <input
          type="text"
          name="name"
          placeholder="Nama"
          value={formData.name}
          onChange={handleInputChange}
          className="form-input"
        />
        <input
          type="text"
          name="number"
          placeholder="Nomor Telepon"
          value={formData.number}
          onChange={handleInputChange}
          className="form-input"
        />
        <button type="submit" className={`act-button ${isEditing ? 'edit-button' : 'add-button'}`}>
          {isEditing ? <Pencil size={20} style={{ backgroundColor:'#2374e1' }} /> : <Plus size={20} style={{ backgroundColor:'#2374e1' }} />}
        </button>
      </form>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Cari kontak..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />
        <button className="act-button search-button">
           <Search size={20} style={{ backgroundColor:'#2374e1' }} />
        </button>
      </div>

      {/* Tabel Kontak */}
      <table className="contacts-table">
        <thead>
          <tr>
            <th style={{ textAlign:'center' }}>No</th>
            <th style={{ textAlign:'center' }}>Nama</th>
            <th style={{ textAlign:'center' }}>Nomor Telepon</th>
            <th style={{ textAlign:'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact, index) => (
            <tr key={contact.id}>
              <td style={{ textAlign:'center' }}>{index + 1}</td>
              <td style={{ textAlign:'center' }}>{contact.name}</td>
              <td style={{ textAlign:'center' }}>{contact.number}</td>
              <td style={{ textAlign:'center' }}>
                <button
                  className="act-button edit-button"
                  onClick={() => handleEditClick(contact)}
                >
                  <SquarePen size={20} style={{ backgroundColor:'#2374e1' }} />
                </button>
                <button
                  className="act-button delete-button"
                  onClick={() => handleDelete(contact.id)}
                >
                  <Trash2 size={20} style={{ backgroundColor:'#f02849' }}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}