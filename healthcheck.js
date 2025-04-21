require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

(async () => {
  const {
    SERVER_URL,
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
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    const res = await axios.get(SERVER_URL, { timeout: 5000 });
    console.log(new Date().toISOString(), 'OK:', res.status);
  } catch (err) {
    console.error(new Date().toISOString(), 'ERROR:', err.message);
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `⚠️ Health Check Failed`,
      text: `Ping ${SERVER_URL} error:\n${err.message}`,
    });
  }
})();
