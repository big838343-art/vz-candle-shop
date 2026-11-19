import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      const errorDesc = searchParams.get("error_description");
      window.opener?.postMessage({
        type: "vk_auth_error",
        error: errorDesc || "Ошибка входа",
      }, "http://localhost:5173");
      window.close();
      return;
    }

    if (!code) {
      window.opener?.postMessage(
        { type: "vk_auth_error", error: "Нет code" },
        "http://localhost:5173"
      );
      window.close();
      return;
    }

    // Обмениваем code на access_token
    fetch(
      `https://oauth.vk.com/access_token?client_id=54908343&redirect_uri=http://localhost:5173/auth/callback&client_secret=&code=${code}&v=5.131`,
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          // Получаем данные пользователя
          fetch(
            `https://api.vk.com/method/users.get?user_ids=${data.user_id}&v=5.131&fields=photo_200`,
            { method: "GET" }
          )
            .then((res) => res.json())
            .then((userData) => {
              if (userData.response?.[0]) {
                const user = {
                  id: data.user_id,
                  first_name: userData.response[0].first_name,
                  last_name: userData.response[0].last_name,
                  username: userData.response[0].username,
                  avatar: userData.response[0].photo_200,
                  provider: "vk",
                  token: data.access_token,
                };
                window.opener?.postMessage(
                  { type: "vk_auth_success", user },
                  "http://localhost:5173"
                );
                window.close();
              }
            })
            .catch(() => {
              window.opener?.postMessage(
                { type: "vk_auth_error", error: "Ошибка получения данных" },
                "http://localhost:5173"
              );
              window.close();
            });
        } else {
          window.opener?.postMessage(
            { type: "vk_auth_error", error: "Нет access_token" },
            "http://localhost:5173"
          );
          window.close();
        }
      })
      .catch(() => {
        window.opener?.postMessage(
          { type: "vk_auth_error", error: "Ошибка сети" },
          "http://localhost:5173"
        );
        window.close();
      });
  }, [searchParams]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "Inter, sans-serif",
    }}>
      <p>Вход через VK...</p>
    </div>
  );
}
