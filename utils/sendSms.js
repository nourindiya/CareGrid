async function sendCriticalAlert(message) {
  try {
    const phone = process.env.DOCTOR_ALERT_PHONE_INTL; // full international format with +

    if (!phone) {
      console.log("No phone configured — SMS simulated:", message);
      return { simulated: true, message };
    }

    const response = await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone,
        message: message,
        key: "textbelt", // free shared test key — 1 free SMS per day per IP
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { simulated: false, textId: result.textId };
    } else {
      console.log("Textbelt SMS failed:", result.error);
      return { simulated: true, error: result.error };
    }
  } catch (err) {
    console.log("SMS failed, falling back to simulation:", err.message);
    return { simulated: true, error: err.message };
  }
}

module.exports = sendCriticalAlert;