import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Primary key',
    example: 'a495f543-05af-4e70-b653-80037f81c1fa',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: String,
    description: ' first name',
    example: 'winston',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    type: String,
    description: ' last name',
    example: 'morgan',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'email',
    example: 'email@sign.up',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: ' password',
    example: 'hguijonkouibyvtcfyguvhijbokn',
    minimum: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
