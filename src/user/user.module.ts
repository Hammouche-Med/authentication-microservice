import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DatabaseModule } from 'sequelize/database.module';
import { userProvider } from './user.provider';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [UserService],
})
export class UserModule {}
