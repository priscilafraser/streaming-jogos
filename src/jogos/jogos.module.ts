import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JogoRepository } from './jogos.repository';
import { JogosService } from './jogos.service';
import { JogosController } from './jogos.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([JogoRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [JogosService],
  controllers: [JogosController],
})
export class JogosModule {}
