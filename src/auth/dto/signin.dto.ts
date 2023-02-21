import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    description: 'email',
    example: 'email@sign.in',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: ' password',
    example: 'srdxyctfuvygibhuojnkjhuibgyuvtfcyr',
    minimum: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
