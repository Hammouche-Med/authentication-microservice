import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';
import { AuthService } from './auth.service';
import { ChangePwdDto } from './dto/change-pwd.dto';
import { ResetPwdDto } from './dto/reset.dto';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signup(@Body() signUpDto: SignUpDto): Promise<AppResponse> {
    try {
      const data = await this.authService.signUp(signUpDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'SignUp',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/sign-in')
  async signin(@Body() signInDto: SignInDto): Promise<AppResponse> {
    try {
      const data = await this.authService.signIn(signInDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'SignIn',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/forgot-password')
  async forgotPwd(@Body() resetPwdDto: ResetPwdDto): Promise<AppResponse> {
    try {
      const data = await this.authService.forgotPwd(resetPwdDto.email);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'reset',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/reset-password/:token')
  async reset(
    @Body() changePwdDto: ChangePwdDto,
    @Param('token') token,
  ): Promise<AppResponse> {
    try {
      const data = await this.authService.resetPwd(
        token,
        changePwdDto.new_password,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'reset',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
