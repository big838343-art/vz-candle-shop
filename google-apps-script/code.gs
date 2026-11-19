/**
 * Google Apps Script для пересылки сообщений в Telegram
 * 
 * 1. Откройте https://script.google.com
 * 2. "Новый проект"
 * 3. Вставьте этот код
 * 4. "Развернуть" → "Новое развертывание" → "Веб-приложение"
 * 5. Execute as: Me, Who has access: Anyone
 * 6. Скопируйте URL и вставьте в telegram.js → GOOGLE_SCRIPT_URL
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const token = data.telegramToken;
    const chatId = data.telegramChatId;
    const message = data.message;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    };

    const response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
