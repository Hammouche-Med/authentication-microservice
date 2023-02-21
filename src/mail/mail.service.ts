import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendResetMail(email, key) {
    try {
      const url = `localhost:3000/auth/change-pwd/${key}`;
      return this.mailerService.sendMail({
        to: email,
        subject: 'We have recieved a request to reset your password',
        template: './index',
        context: {
          email: email,
          url: url,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
