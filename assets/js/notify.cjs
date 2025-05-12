const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

require('dotenv').config({ path: '../../../email.env' });


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { email, vehicle, tasks } = req.body;

  const htmlBody = `
    <h2>AutoCare Maintenance Reminder</h2>
    <p>Your vehicle <strong>${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.trim})</strong> has the following maintenance items:</p>
    <ul>${tasks.map(task => `<li>${task}</li>`).join('')}</ul>
    <p>Stay on track with AutoCare!</p>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Upcoming Maintenance for ${vehicle.year} ${vehicle.make}`,
    html: htmlBody
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Email error:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Email sent:", info.response);
    res.json({ status: "sent", info: info.response });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Email server running on port ${PORT}`);
});
