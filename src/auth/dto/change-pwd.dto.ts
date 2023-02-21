import { IsString, MinLength } from 'class-validator';

export class ChangePwdDto {
  @IsString()
  @MinLength(10)
  new_password: string;
}
