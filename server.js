import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

app.post("/api/order", async (req, res) => {
  try {
    const message = formatMessage(req.body);
    const result = await sendToTelegram(message);

    if (result.ok) {
      res.json({ success: true });
    } else {
      console.error("Telegram error:", result);
      res.status(500).json({ success: false, error: result.description });
    }
  } catch (error) {
    console.error("Server error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`📦 Server running on http://127.0.0.1:${PORT}`);
});
