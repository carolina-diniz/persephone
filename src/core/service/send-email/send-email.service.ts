import 'dotenv/config';
import nodemailer from 'nodemailer';
import { RemoteConfig } from '../remote-config';

export async function sendEmail(to: string, subject: string, text: string, code: string) {
  const mailOptions = {
    from: process.env.G_USER,
    to,
    subject,
    text,
  };

  if (RemoteConfig.sendEmail) {
    await transporter
      .sendMail(mailOptions)
      .then((SentMessageInfo) =>
        console.log(`Email sent successfully to: ${SentMessageInfo.accepted[0]}`),
      )
      .catch((error) => {
        console.error('Error sending email: ', error);
      });
  } else {
    console.log(mailOptions);
    console.log(`Email de verificação não enviado: código ${code}`);
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.G_USER,
    pass: process.env.G_PASS,
  },
});
