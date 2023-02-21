import { config } from 'dotenv';
config({ path: `.env` });

export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  mailHost: process.env.MAIL_HOST,
  mailUser: process.env.MAIL_USER,
  mailPwd: process.env.MAIL_PASSWORD,
  mailFrom: process.env.MAIL_FROM,
});
