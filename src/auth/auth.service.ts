import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { isEmpty } from 'src/utils/utils';
import { User } from 'src/user/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findUserByToken(token: string) {
    const findUser: User = await this.userRepository.scope('auth').findOne({
      where: { reset_token: token },
    });
    if (!findUser) return false;
    return findUser;
  }
  async signUpUser(user: SignUpDto) {
    const response = await this.userRepository.create({
      ...user,
    });
    return response;
  }
  async findUserByEmail(email: string) {
    const findUser: User = await this.userRepository.scope('auth').findOne({
      where: { email: email },
    });
    if (!findUser) return false;
    return findUser;
  }

  async signUp(user: SignUpDto) {
    if (isEmpty(user))
      throw new HttpException('Invalid DATA', HttpStatus.BAD_REQUEST);
    const findUser = await this.findUserByEmail(user.email);
    if (findUser)
      throw new HttpException(
        `You'r phone ${user.email} already exists`,
        HttpStatus.CONFLICT,
      );
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
    const userData = await this.signUpUser(user);
    const token = await this.jwtService.sign({ id: userData.id });
    return { token, user: userData };
  }

  async signIn(user: SignInDto) {
    const findUser = await this.findUserByEmail(user.email);
    if (!findUser) throw new HttpException('Invalid User', HttpStatus.CONFLICT);
    const passwordValid = await compare(user.password, findUser.password);
    if (!passwordValid) {
      throw new UnauthorizedException();
    } else {
      const payload = { id: findUser.id };
      const token = await this.jwtService.sign(payload);
      return { token, user: findUser };
    }
  }

  async forgotPwd(email: string) {
    const findUser = await this.findUserByEmail(email);
    if (!findUser) throw new HttpException('Invalid User', HttpStatus.CONFLICT);
    const token = await (Math.random() + 1).toString(36).slice(2, 20);
    const updatedUser = await this.userService.update(findUser.id, {
      reset_token: token,
    });
    this.mailService
      .sendResetMail(email, token)
      .then((res) => {
        console.log('----MAIL_SERVICE_RESPONSE---', res);
        return true;
      })
      .catch((err) => {
        console.log('----MAIL_SERVICE_ERROR---', err);
        return false;
      });
    await this.eventEmitter.emit('reset_token.created', findUser.id);
    return { user: updatedUser };
  }

  @OnEvent('reset_token.created')
  async handleOrderCreatedEvent(payload: string) {
    setTimeout(async () => {
      await this.userService.update(payload, {
        reset_token: null,
      });
      console.log('reset_token set to null for user_id: ', payload);
      //exec time 10min
    }, 600000);
  }

  async resetPwd(token: string, new_password: string) {
    const findUser = await this.findUserByToken(token);
    if (!findUser)
      throw new HttpException('Invalid Token', HttpStatus.CONFLICT);
    const hashedPassword = await hash(new_password, 10);
    const updatedUser = await this.userService.update(findUser.id, {
      reset_token: null,
      password: hashedPassword,
    });
    return updatedUser;
  }
}
