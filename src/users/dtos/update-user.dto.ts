import { UserRole } from '../user-roles.enum';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString({ message: 'Informe um nome de usuário válido' })
  @ApiProperty()
  usuario: string;

  @IsOptional()
  @ApiProperty()
  role: UserRole;

  @IsOptional()
  @ApiProperty()
  status: boolean;
}
