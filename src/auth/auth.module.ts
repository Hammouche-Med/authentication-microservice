import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { userProvider } from 'src/user/user.provider';
import configuration from 'config/configuration';

@Module({
  imports: [
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: configuration().jwtSecret,
      signOptions: { expiresIn: '48h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...userProvider],
})
export class AuthModule {}
