import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Delete,
  Param,
  Get,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
import { CreateJogoDto } from './dtos/create-jogo.dto';
import { ReturnJogoDto } from './dtos/return-jogo.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from '../auth/role.decorator';
import { UserRole } from '../users/user-roles.enum';
import { JogosService } from './jogos.service';
import { UpdateJogoDto } from './dtos/update-jogo.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Jogos')
@Controller('jogos')
@UseGuards(AuthGuard(), RolesGuard)
export class JogosController {
  constructor(private jogosService: JogosService) {}

  @Post()
  //@Role(UserRole.ADMIN)
  @ApiCreatedResponse({ description: 'Jogo cadastrado com sucesso' })
  async createJogo(
    @Body(ValidationPipe) createJogoDto: CreateJogoDto,
  ): Promise<ReturnJogoDto> {
    const jogo = await this.jogosService.createJogo(createJogoDto);
    return {
      jogo,
      message: 'Jogo cadastrado com sucesso',
    };
  }

  @Get()
  @ApiOkResponse({ description: 'Sucesso' })
  findAll() {
    return this.jogosService.findAll();
  }

  @Get('/:id')
  //@Role(UserRole.ADMIN)
  @ApiOkResponse({ description: 'Jogo encontrado' })
  async findJogoById(@Param('id') id: string): Promise<ReturnJogoDto> {
    const jogo = await this.jogosService.findJogoById(id);
    return {
      jogo,
      message: 'Jogo encontrado',
    };
  }

  @Patch('/:id')
  @ApiForbiddenResponse({ description: 'Você não tem autorização para acessar esse recurso' })
  async updateJogo(
    @Body(ValidationPipe) updateJogoDto: UpdateJogoDto,
    @GetUser() user: User,
    @Param('id') id: string,
  ) {
    if (user.role != UserRole.ADMIN && user.role != UserRole.USER)
      throw new ForbiddenException(
        'Você não tem autorização para acessar esse recurso',
      );
    else {
      return this.jogosService.updateJogo(updateJogoDto, id);
    }
  }

  @Delete('/:id')
  //@Role(UserRole.ADMIN)
  @ApiOkResponse({ description: 'Jogo excluído com sucesso' })
  async deleteUser(@Param('id') id: string) {
    await this.jogosService.deleteUser(id);
    return { message: 'Jogo excluído com sucesso' };
  }
}
