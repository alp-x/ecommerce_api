import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Kullanıcı adı' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Kullanıcı email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Kullanıcı şifresi' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Kullanıcı telefon numarası', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
} 