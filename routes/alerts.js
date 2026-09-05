const express = require("express");
const router = express.Router();
const sendDiscordAlert = require("../utils/sendDiscordAlert");

router.post("/code-blue", async (req, res) => {
  try {
    const { patientName, location, triggeredBy } = req.body;
    const message = `🚨 **CODE BLUE** 🚨\nPatient: ${patientName}\nLocation: ${location}\nTriggered by: ${triggeredBy}\nTime: ${new Date().toLocaleString()}`;

    const result = await sendDiscordAlert(message);
    res.json({ message: "Code Blue alert sent", discordResult: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;