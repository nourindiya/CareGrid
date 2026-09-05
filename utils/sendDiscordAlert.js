async function sendDiscordAlert(message) {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) {
      console.log("Discord webhook not configured — alert simulated:", message);
      return { simulated: true };
    }

    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    return { simulated: false, sent: response.ok };
  } catch (err) {
    console.log("Discord alert failed:", err.message);
    return { simulated: true, error: err.message };
  }
}

module.exports = sendDiscordAlert;