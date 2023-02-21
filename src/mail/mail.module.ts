import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: configuration().mailHost,
          secure: false,
          auth: {
            user: configuration().mailUser,
            pass: configuration().mailPwd,
          },
        },
        defaults: {
          from: `"No Reply" <${configuration().mailFrom}>`,
        },
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
