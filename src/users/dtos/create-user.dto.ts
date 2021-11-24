import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe um endereço de e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(200, { message: 'O e-mail deve ter menos de 200 caracteres' })
  email: string;

  @ApiProperty({ description: 'Confirmação do e-mail do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe um endereço de e-mail' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(200, { message: 'O e-mail deve ter menos de 200 caracteres' })
  emailConfirmation: string;

  @ApiProperty({ description: 'País do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe o seu país' })
  @MaxLength(60, {
    message: 'O país deve ter menos de 60 caracteres',
  })
  pais: string;

  @ApiProperty({ description: 'Data de nascimento do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe a data de nascimento do usuário' })
  @MaxLength(30, { message: 'A data deve ter no máximo 30 caracteres' })
  nascimento: string;

  @ApiProperty({ description: 'Username do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe um nome de usuário' })
  @MaxLength(200, { message: 'O nome deve ter menos de 200 caracteres' })
  usuario: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe uma senha' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password: string;

  @ApiProperty({ description: 'Confirmação da senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Informe a confirmação da senha' })
  @MinLength(8, {
    message: 'A confirmação da senha deve ter pelo menos 8 caracteres',
  })
  passwordConfirmation: string;

  @ApiProperty({ description: 'Jogos associados ao usuário' })
  @IsString({ each: true })
  jogos: string[];
}
