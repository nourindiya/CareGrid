async function sendCriticalAlert(message) {
  try {
    const webhookUrl = process.env.DISCORD_VITALS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.log("Discord vitals webhook not configured — alert simulated:", message);
      return { simulated: true, message };
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚨 **CRITICAL VITALS ALERT** 🚨\n${message}`,
      }),
    });

    if (response.ok) {
      return { simulated: false, sent: true };
    } else {
      const errText = await response.text();
      console.log("Discord vitals alert failed:", errText);
      return { simulated: true, error: errText };
    }
  } catch (err) {
    console.log("Alert failed, falling back to simulation:", err.message);
    return { simulated: true, error: err.message };
  }
}

module.exports = sendCriticalAlert;