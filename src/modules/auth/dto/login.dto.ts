import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Kullanıcı email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Kullanıcı şifresi' })
  @IsString()
  @MinLength(6)
  password: string;
}
