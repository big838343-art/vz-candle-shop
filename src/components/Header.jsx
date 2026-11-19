import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import "./Header.css";

export default function Header() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-main">VZ</span>
          <span className="logo-sub">Valentina Zaikina</span>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Каталог
          </Link>
          <Link to="/cart" className="nav-link nav-cart">
            <span className="cart-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </span>
          </Link>
          
          {user ? (
            <div className="user-menu" onClick={() => setShowAuthModal(true)}>
              <div className="user-avatar">
                {user.photo_url ? (
                  <img src={user.photo_url} alt="Avatar" />
                ) : user.avatar ? (
                  <img src={user.avatar} alt="Avatar" />
                ) : (
                  <span>{user.first_name?.[0] || user.username?.[0] || "U"}</span>
                )}
              </div>
              <span className="user-name">
                {user.first_name?.split(" ")[0] || user.username || "Профиль"}
              </span>
            </div>
          ) : (
            <button className="nav-link auth-link" onClick={() => setShowAuthModal(true)}>
              Войти
            </button>
          )}
        </nav>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
