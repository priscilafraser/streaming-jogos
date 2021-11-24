import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Jogo } from './jogo.entity';
import { CreateJogoDto } from './dtos/create-jogo.dto';
import { UserRole } from '../users/user-roles.enum';

@EntityRepository(Jogo)
export class JogoRepository extends Repository<Jogo> {
  async createJogo(
    createJogoDto: CreateJogoDto,
    role: UserRole,
  ): Promise<Jogo> {
    const { titulo, imagem_url, descricao, genero, lancamento } = createJogoDto;
    const jogo = this.create();
    jogo.titulo = titulo;
    jogo.imagem_url = imagem_url;
    jogo.descricao = descricao;
    jogo.genero = genero;
    jogo.lancamento = lancamento;

    try {
      await jogo.save();
      return jogo;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Jogo já cadastrado!');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o jogo no banco de dados',
        );
      }
    }
  }
}
