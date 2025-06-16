import { useEffect, useState } from 'react';
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


  const totalMessages = selectedContacts?.length * repeat || 0;
  const [sentCount, setSentCount] = useState(0);
  const sock = useSockStore((state) => state.sock); // ✅ ini reactive

  useEffect(() => {
    if (!message || !repeat || !selectedContacts) {
      navigate('/send-message');
      return;
    }

       sendMessageMultipleTimes()

    
   
  

    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < totalMessages) {
        currentIndex++;
        const progressPercentage = (currentIndex / totalMessages) * 100;
        setProgress(progressPercentage);
        setSentCount(currentIndex);
        
        // Calculate current contact and message count
        const contactIndex = Math.floor((currentIndex - 1) / repeat);
        const messageCount = ((currentIndex - 1) % repeat) + 1;
        
        const status = `Mengirim pesan ${messageCount}/${repeat} ke ${selectedContacts[contactIndex]?.name || 'unknown'}`;
        setCurrentStatus(status);
        setMessageLog(prev => [...prev, status]);
      } else {
        clearInterval(interval);
        setCompleted(true);
        setCurrentStatus('Semua pesan telah terkirim!');
      }
    }, 1000);

    return () => {
      clearInterval(interval)
      console.log('Cleanup: Interval cleared and event listener removed');
    };
  }, [message, repeat, selectedContacts, totalMessages, navigate,sock]);


 const sendMessageMultipleTimes = async () => {
  const nomorList = ['6289680810704']; // nomor WA tanpa @s.whatsapp.net
  const repeat = 3; // jumlah pengulangan per nomor
  const message = 'bisa nggak sih!'; // pesan yang akan dikirim

  for (const nomor of nomorList) {
    for (let i = 1; i <= repeat; i++) {
      await window.electron.ipcRenderer.invoke('send-message', {
        number: `${nomor}@s.whatsapp.net`,
        message
      })
      console.log(`✅ Pesan ${i} terkirim ke ${nomor}`)
      await new Promise((r) => setTimeout(r, 3000))
    }
  }
}

  
  

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