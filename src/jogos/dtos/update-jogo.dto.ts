import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJogoDto {
  @IsOptional()
  @ApiProperty()
  titulo: string;

  @IsOptional()
  @ApiProperty()
  imagem_url: string;

  @IsOptional()
  @ApiProperty()
  descricao: string;

  @IsOptional()
  @ApiProperty()
  genero: string;

  @IsOptional()
  @ApiProperty()
  lancamento: string;
}
