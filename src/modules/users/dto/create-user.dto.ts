import { IsEmail, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Email adresi' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Şifre' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Ad' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Soyad' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Kullanıcı rolleri', enum: Role, isArray: true })
  @IsArray()
  @IsOptional()
  roles?: Role[];

  @ApiProperty({ description: 'Telefon numarası', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ description: 'Adres', required: false })
  @IsString()
  @IsOptional()
  address?: string;
} 