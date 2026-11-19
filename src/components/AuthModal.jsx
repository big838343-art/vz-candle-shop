import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose }) {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    login(null);
    onClose();
  };

  const handleVKLogin = async () => {
    setLoading(true);
    setError("");

    const clientId = "54908343";
    const redirectUri = "http://localhost:5173/auth/callback";
    const state = Math.random().toString(36).substring(7);
    
    const vkUrl = `https://oauth.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&display=popup&response_type=code&state=${state}&scope=email`;
    
    const width = 600;
    const height = 700;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    const popup = window.open(vkUrl, "vk_auth", `width=${width},height=${height},left=${left},top=${top}`);

    // Таймаут если popup закрыт
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkClosed);
        setLoading(false);
      }
    }, 500);
  };

  const handleTelegramLogin = () => {
    const botName = "vz_candle_shop_bot";
    const widgetUrl = `https://oauth.telegram.org/auth?bot_name=${botName}&origin=http%3A%2F%2Flocalhost%3A5173&request_access=write`;
    
    const width = 400;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    const popup = window.open(widgetUrl, "tg_auth", `width=${width},height=${height},left=${left},top=${top}`);

    const messageHandler = (event) => {
      if (event.origin !== "https://oauth.telegram.org") return;
      
      if (event.data) {
        const userData = event.data;
        if (userData.id) {
          const user = {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            photo_url: userData.photo_url,
            provider: "telegram"
          };
          login(user);
          onClose();
        }
      }
    };

    window.addEventListener("message", messageHandler);

    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener("message", messageHandler);
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>×</button>
        
        {user ? (
          <div className="auth-profile">
            <div className="profile-avatar">
              {user.photo_url ? (
                <img src={user.photo_url} alt="Avatar" />
              ) : user.avatar ? (
                <img src={user.avatar} alt="Avatar" />
              ) : (
                <span>{user.first_name?.[0] || user.username?.[0] || "U"}</span>
              )}
            </div>
            <h3 className="profile-name">
              {user.first_name} {user.last_name || ""}
            </h3>
            {user.username && (
              <p className="profile-username">@{user.username}</p>
            )}
            <p className="profile-provider">
              {user.provider === "vk" ? "ВКонтакте" : "Telegram"}
            </p>
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h2>Войти</h2>
              <p>Войдите для отслеживания заказов</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-buttons">
              <button className="auth-btn vk" onClick={handleVKLogin} disabled={loading}>
                <svg className="auth-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4C75A3" d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.367 1.26 2.182 1.816.617.42 1.085.328 1.085.328l2.18-.03s1.14-.07.6-.964c-.044-.073-.316-.661-1.624-1.868-1.37-1.263-1.186-1.059.464-3.266.998-1.344 1.397-2.167 1.273-2.52-.12-.335-.856-.246-.856-.246l-2.453.015s-.182-.025-.317.056c-.132.079-.217.264-.217.264s-.39 1.038-.91 1.92c-1.098 1.863-1.537 1.963-1.716 1.846-.417-.272-.313-1.095-.313-1.679 0-1.826.277-2.587-.539-2.784-.27-.065-.47-.108-1.16-.115-.887-.01-1.639.003-2.063.21-.283.138-.5.444-.367.462.164.021.535.1.732.368.254.346.245 1.12.245 1.12s.146 2.144-.34 2.41c-.333.183-.79-.19-1.773-1.894-.503-.873-.883-1.838-.883-1.838s-.073-.18-.204-.277c-.158-.118-.38-.155-.38-.155l-2.33.015s-.35.01-.478.162c-.114.135-.009.414-.009.414s1.837 4.3 3.92 6.467c1.907 1.987 4.073 1.857 4.073 1.857h.982z"/>
                </svg>
                {loading ? "Вход..." : "Войти через VK"}
              </button>

              <button className="auth-btn telegram" onClick={handleTelegramLogin} disabled={loading}>
                <svg className="auth-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#2AABEE" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.484-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.23.168.332.016.102.036.324.02.498z"/>
                </svg>
                {loading ? "Вход..." : "Войти через Telegram"}
              </button>
            </div>

            <p className="auth-hint">
              Вход бесплатный и занимает 5 секунд
            </p>
          </>
        )}
      </div>
    </div>
  );
}
