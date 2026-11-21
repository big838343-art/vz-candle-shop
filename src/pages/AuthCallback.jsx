import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем error в query params
    const error = searchParams.get("error");
    if (error) {
      const errorDesc = searchParams.get("error_description");
      window.opener?.postMessage(
        { type: "vk_auth_error", error: errorDesc || "Ошибка входа" },
        "http://localhost:5173"
      );
      window.close();
      return;
    }

    // Для implicit grant: токен в hash (#access_token=...)
    const hash = window.location.hash.substring(1); // убираем #
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const userId = params.get("user_id");

    if (accessToken && userId) {
      // Получаем данные пользователя
      fetch(
        `https://api.vk.com/method/users.get?user_ids=${userId}&v=5.131&fields=photo_200`
      )
        .then((res) => res.json())
        .then((userData) => {
          if (userData.response?.[0]) {
            const user = {
              id: parseInt(userId),
              first_name: userData.response[0].first_name,
              last_name: userData.response[0].last_name,
              username: userData.response[0].username,
              avatar: userData.response[0].photo_200,
              provider: "vk",
              token: accessToken,
            };
            window.opener?.postMessage(
              { type: "vk_auth_success", user },
              "http://localhost:5173"
            );
            window.close();
          } else {
            window.opener?.postMessage(
              { type: "vk_auth_error", error: "Не удалось получить данные пользователя" },
              "http://localhost:5173"
            );
            window.close();
          }
        })
        .catch(() => {
          // Даже если не получили фото, создаём пользователя с базовыми данными
          const user = {
            id: parseInt(userId),
            first_name: "Пользователь",
            provider: "vk",
            token: accessToken,
          };
          window.opener?.postMessage(
            { type: "vk_auth_success", user },
            "http://localhost:5173"
          );
          window.close();
        });
    } else {
      window.opener?.postMessage(
        { type: "vk_auth_error", error: "Не получен токен авторизации" },
        "http://localhost:5173"
      );
      window.close();
    }
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
