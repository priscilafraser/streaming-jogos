import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from 'src/users/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CredentialsDto } from './credentials.dto';
import { User } from '../users/user.entity';
import { UserRole } from 'src/users/user-roles.enum';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { ChangePasswordDto } from './change-password.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password != createUserDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    } else {
      const user = await this.userRepository.createUser(
        createUserDto,
        UserRole.USER,
      );

      const mail = {
        to: user.email,
        from: 'noreply@steam.com',
        subject: 'Confirme seu e-mail',
        template: './email-confirmation',
        context: {
          token: user.confirmacaoToken,
        },
      };

      return user;
    }
  }

  async signIn(credentialsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentialsDto);
    if (user === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jwtPayload = {
      id: user.id,
    };
    const token = await this.jwtService.sign(jwtPayload);
    return { token };
  }

  async confirmEmail(confirmacaoToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmacaoToken },
      { confirmacaoToken: null },
    );
    if (result.affected === 0) throw new NotFoundException('Token inválido');
  }

  async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    user.recoverToken = randomBytes(32).toString('hex');
    await user.save();

    const mail = {
      to: user.email,
      from: 'noreply@steam.com',
      subject: 'Recuperação de senha',
      template: './recover-password',
      context: {
        token: user.recoverToken,
      },
    };
  }

  async changePassword(
    id: string,
    changePassworDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePassworDto;

    if (password != passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }

    await this.userRepository.changePassword(id, password);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne(
      { recoverToken },
      { select: ['id'] },
    );
    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    const { usuario } = updateUserDto;
    user.usuario = usuario ? usuario : user.usuario;

    try {
      await user.save();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }
}
