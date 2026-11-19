/**
 * Отправка заказа в Telegram через Google Apps Script
 */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBXS_NgGDSImIgMbVtlogh-Tde98QtswewcsK8z4FyiCVy9PTkZbutyNQMasIydPI/exec";

const TELEGRAM_TOKEN = "9174037930:AAElsFY46QeFsXLuh66Ot6lcBSmF_06GuOI";
const TELEGRAM_CHAT_ID = "1968276616";

function formatMessage(data) {
  const { name, phone, email, address, comment, items, total } = data;
  const itemsText = items
    .map(
      (item) =>
        `🕯️ ${item.name} (${item.volume}) × ${item.quantity} — ${
          item.price * item.quantity
        } руб.`
    )
    .join("\n");

  return [
    "📦 <b>Новый заказ!</b>",
    "",
    "<b>👤 Контакты:</b>",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Email: ${email || "—"}`,
    "",
    "<b>📍 Доставка:</b>",
    address,
    ...(comment ? [`Комментарий: ${comment}`] : []),
    "",
    "<b>🛒 Заказ:</b>",
    itemsText,
    "",
    `<b>💰 Итого: ${total.toLocaleString("ru-RU")} руб.</b>`,
    `<b>📅 ${new Date().toLocaleString("ru-RU")}</b>`,
  ].join("\n");
}

export async function sendToTelegram(data) {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL не настроен");
    return { success: false, error: "Не настроен" };
  }

  try {
    const message = formatMessage(data);

    // Кодирование сообщения для URL
    const encodedMessage = encodeURIComponent(message);

    const url = `${GOOGLE_SCRIPT_URL}?token=${TELEGRAM_TOKEN}&chatId=${TELEGRAM_CHAT_ID}&message=${encodedMessage}`;

    // Используем no-cors — ответ не читаем, но запрос уходит
    await fetch(url, {
      method: "GET",
      mode: "no-cors",
    });

    console.log("✅ Заказ отправлен в Telegram");
    return { success: true };
  } catch (error) {
    console.error("Ошибка отправки:", error);
    return { success: false, error: error.message };
  }
}

export async function testTelegramConnection() {
  if (!GOOGLE_SCRIPT_URL) {
    return { success: false, message: "Сначала настройте Google Script URL" };
  }

  try {
    const message = encodeURIComponent("✅ Тест от VZ Candle Shop");
    const url = `${GOOGLE_SCRIPT_URL}?token=${TELEGRAM_TOKEN}&chatId=${TELEGRAM_CHAT_ID}&message=${message}`;

    await fetch(url, {
      method: "GET",
      mode: "no-cors",
    });

    return { success: true, message: "✅ Подключение работает! Проверьте Telegram." };
  } catch (error) {
    return { success: false, message: `❌ ${error.message}` };
  }
}
