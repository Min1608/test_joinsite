require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

const {
  SERVER_URL,
  CHECK_INTERVAL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  EMAIL_TO,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendAlert(error) {
  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: `⚠️ Health Check Failed: ${SERVER_URL}`,
    text: `Lỗi khi ping ${SERVER_URL}:\n\n${error.message || error}`,
  });
  console.log('Alert sent:', info.messageId);
}

async function checkHealth() {
  try {
    const res = await axios.get(SERVER_URL, { timeout: 5000 });
    console.log(new Date().toISOString(), 'Status:', res.status);
  } catch (err) {
    console.error(new Date().toISOString(), 'Error:', err.message);
    await sendAlert(err);
  }
}

// Chạy ngay và sau đó định kỳ
checkHealth();
setInterval(checkHealth, Number(CHECK_INTERVAL));
