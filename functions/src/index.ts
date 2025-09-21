import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// IMPORTANT: For this to work, you must set your Telegram Bot Token and Chat ID in your Firebase environment configuration.
// Use the Firebase CLI:
// firebase functions:config:set telegram.token="YOUR_BOT_TOKEN"
// firebase functions:config:set telegram.chat_id="YOUR_CHAT_ID"

export const sendTelegramNotification = functions.https.onCall(async (data, context) => {
  const { amount, address } = data;

  // Basic validation
  if (!amount || !address) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with both 'amount' and 'address' arguments."
    );
  }

  // Retrieve secrets from environment configuration
  const botToken = functions.config().telegram.token;
  const chatId = functions.config().telegram.chat_id;

  if (!botToken || !chatId) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Telegram bot token or chat ID is not configured."
    );
  }

  const message = `
    🚨 *New Withdrawal Request* 🚨

    *Amount:* ${amount} USD
    *Address:* \`${address}\`

    Please review and process this request in the admin panel.
  `;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });

    return { success: true, message: "Notification sent successfully." };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to send Telegram notification."
    );
  }
});
