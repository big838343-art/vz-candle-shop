import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Загружаем пользователя из localStorage
    const savedUser = localStorage.getItem("vz_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("vz_user");
      }
    }

    // Слушаем сообщения от popup (VK)
    const handleMessage = (event) => {
      if (event.origin !== "http://localhost:5173") return;
      
      if (event.data.type === "vk_auth_success") {
        const userData = event.data.user;
        localStorage.setItem("vz_user", JSON.stringify(userData));
        setUser(userData);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const login = (userData) => {
    if (userData) {
      localStorage.setItem("vz_user", JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem("vz_user");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("vz_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
