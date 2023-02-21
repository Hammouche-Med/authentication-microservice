import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Primary key',
    example: 'a495f543-05af-4e70-b653-80037f81c1fa',
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'User first name',
    example: 'winston',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
    example: 'morgan',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    type: String,
    description: 'User mail',
    example: 'mail@nest.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    example: 'UViBJOHU#Omk$jb§ln',
    minimum: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User picture',
    example: 'avatar.png',
  })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiPropertyOptional({
    type: String,
    description: 'User password reset token',
    example: 'zdbhvgeyuiubzoipdẑl,kcjeiopzo',
  })
  @IsOptional()
  @IsString()
  reset_token: string;
}
