import { useEffect, useState,useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './../styles/SendProgress.css';
import useSockStore from '../lib/sockStore.js' // ⬅️ sesuaikan path




export default function SendProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const { message, repeat, selectedContacts } = location.state || {};
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');
  const [completed, setCompleted] = useState(false);
  const [messageLog, setMessageLog] = useState([]);
  const hasStartedRef = useRef(false);



  const totalMessages = selectedContacts?.length * repeat || 0;
  const [sentCount, setSentCount] = useState(0);
  const sock = useSockStore((state) => state.sock); // ✅ ini reactive

 useEffect(() => {
  if (!message || !repeat || !selectedContacts) {
    navigate('/send-message');
    return;
  }

  if (hasStartedRef.current) return;
  hasStartedRef.current = true;

  sendMessageMultipleTimes();
}, [message, repeat, selectedContacts, totalMessages, navigate, sock]);


const sendMessageMultipleTimes = async () => {
  try {
    console.log("Selected Contacts:", selectedContacts);
    let currentIndex = 0;

    for (const contact of selectedContacts) {
      for (let i = 1; i <= repeat; i++) {
        await window.electron.ipcRenderer.invoke('send-message', {
          number: `${contact.number}@s.whatsapp.net`,
          message
        });

        currentIndex++; // total pesan berhasil dikirim
        const progressPercentage = (currentIndex / totalMessages) * 100;
        const status = `Mengirim pesan ${i}/${repeat} ke ${contact.name}`;

        setSentCount(currentIndex);
        setProgress(progressPercentage);
        setCurrentStatus(status);
        setMessageLog(prev => [...prev, status]);

        console.log(`✅ Pesan ${i} terkirim ke ${contact.number}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    setCompleted(true);
    setCurrentStatus('Semua pesan telah terkirim!');
  } catch (error) {
    console.error("Error in sendMessageMultipleTimes:", error);
  }
};



  
  

  return (
    <div className="send-progress-container">
      <h1 style={{ backgroundColor:'#242526' }}>Progress Pengiriman Pesan</h1>
      
      <div className="progress-info" style={{ backgroundColor:'#242526' }}>
        <div className="progress-stats" style={{ backgroundColor:'#242526' }}>
          <span style={{ backgroundColor:'#242526' }}>{sentCount} dari {totalMessages} pesan terkirim</span>
          <span style={{ backgroundColor:'#242526' }}>{Math.round(progress)}%</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="current-status" style={{ backgroundColor:'#242526' }}>{currentStatus}</div>
        
        {/* Message log showing all sent messages */}
        <div className="message-log">
          <h3 style={{ backgroundColor:'#3a3b3c' }}>Riwayat Pengiriman:</h3>
          <ul style={{ backgroundColor:'#3a3b3c' }}>
            {messageLog.map((log, index) => (
              <li key={index} style={{ backgroundColor:'#3a3b3c' }}>{log}</li>
            ))}
          </ul>
        </div>
      </div>

      {completed && (
        <button 
          className="action-button"
          onClick={() => navigate('/send-message')}
        >
          Kembali ke Halaman Utama
        </button>
      )}
    </div>
  );
}