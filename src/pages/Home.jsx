import { Link, Outlet } from 'react-router-dom';
import '../styles/Topbar.css';

export default function Home() {
  return (
    <div className="app-container">
      {/* Topbar */}
      <div className="topbar">
        <Link to="/contact" className="menu-button">
          Contact Management
        </Link>
        <Link to="/send-message" className="menu-button">
          Kirim Pesan
        </Link>
      </div>

      {/* Container Konten */}
      <div className="content-container">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}