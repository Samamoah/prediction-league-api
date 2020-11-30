const { SMTPClient } = require('emailjs');

const client = new SMTPClient({
  user: 'predictionleagueonline@gmail.com',
  password: 'predictionleague',
  host: 'smtp.gmail.com',
  ssl: true,
  post: 465,
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'predictionleagueonline@gmail.com',
    pass: 'predictionleague', // naturally, replace both with your real credentials or an application-specific password
  },
});

module.exports = { client, transporter };
