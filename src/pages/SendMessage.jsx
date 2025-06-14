import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import '../styles/SendMessage.css';

export default function SendMessage() {
  const [message, setMessage] = useState('');
  const [repeat, setRepeat] = useState(1);
  const textareaRef = useRef(null);

  // Resize textarea saat isi berubah
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pesan "${message}" akan dikirim ${repeat} kali!`);
  };

  return (
    <div className="send-message-container">
      <h1 className="send-message-title">Blasting Pesan</h1>
      <form onSubmit={handleSubmit} className="send-message-form">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          placeholder="Tulis pesan..."
          required
        />

        <div className="repeat-group">
          <label className="repeat-label">Berapa kali</label>
          <input
            type="number"
            min="1"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="repeat-input"
            required
          />
        </div>

        <button type="submit" className="send-button" title="Kirim">
          <Send size={20} style={{ backgroundColor:'#0084ff' }} />
        </button>
      </form>
    </div>
  );
}
