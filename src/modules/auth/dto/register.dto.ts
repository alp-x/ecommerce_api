import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Şifre' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Ad' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ description: 'Soyad' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ description: 'Telefon numarası', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Adres', required: false })
  @IsString()
  @IsOptional()
  address?: string;
} 