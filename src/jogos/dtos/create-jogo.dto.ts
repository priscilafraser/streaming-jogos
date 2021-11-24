import { ApiProperty } from "@nestjs/swagger";

export class CreateJogoDto {

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  imagem_url: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  genero: string;

  @ApiProperty()
  lancamento: string;
}
