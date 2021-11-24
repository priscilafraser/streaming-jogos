import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JogoRepository } from './jogos.repository';
import { UserRole } from '../users/user-roles.enum';
import { CreateJogoDto } from './dtos/create-jogo.dto';
import { Jogo } from './jogo.entity';
import { UpdateJogoDto } from './dtos/update-jogo.dto';

@Injectable()
export class JogosService {
  constructor(
    @InjectRepository(JogoRepository)
    private jogoRepository: JogoRepository,
  ) {}

  async createJogo(createJogoDto: CreateJogoDto): Promise<Jogo> {
    return this.jogoRepository.createJogo(createJogoDto, UserRole.ADMIN);
  }

  async findAll() {
    return this.jogoRepository.find({
      relations: ['users'],
    });
  }

  async findJogoById(jogoId: string): Promise<Jogo> {
    const jogo = await this.jogoRepository.findOne(jogoId, {
      select: ['titulo', 'genero', 'lancamento', 'id'],
    });

    if (!jogo) throw new NotFoundException('Jogo não encontrado');

    return jogo;
  }

  async updateJogo(updateJogoDto: UpdateJogoDto, id: string): Promise<Jogo> {
    const jogo = await this.findJogoById(id);
    const { titulo, imagem_url, descricao, genero, lancamento } = updateJogoDto;
    jogo.titulo = titulo ? titulo : jogo.titulo;
    jogo.imagem_url = imagem_url ? imagem_url : jogo.imagem_url;
    jogo.descricao = descricao ? descricao : jogo.descricao;
    jogo.genero = genero ? genero : jogo.genero;
    jogo.lancamento = lancamento ? lancamento : jogo.lancamento;

    try {
      await jogo.save();
      return jogo;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao atualizar os dados no banco de dados',
      );
    }
  }

  async deleteUser(jogoId: string) {
    const result = await this.jogoRepository.delete({ id: jogoId });
    if (result.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um jogo com o ID informado',
      );
    }
  }
}
