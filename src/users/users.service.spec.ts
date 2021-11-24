import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import { UnprocessableEntityException } from '@nestjs/common';

const mockUserRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  findUsers: jest.fn(),
});

describe('UsersService', () => {
  let userRepository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UsersService>(UsersService);
  });

  it('Eles devem ser definidos', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDto;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'algumacoisa@gmail.com',
        emailConfirmation: 'algumacoisa@gmail.com',
        pais: 'jdshshjd',
        nascimento: '6543225',
        usuario: 'Bill Gates',
        password: '123',
        passwordConfirmation: '123',
        jogos: [],
      };
    });

    it('deve criar usuario se as duas senhas conferem', async () => {
      userRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createUser(mockCreateUserDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.USER,
      );
      expect(result).toEqual('mockUser');
    });

    it('deve jogar erro se as senhas nao conferem', async () => {
      mockCreateUserDto.passwordConfirmation = 'nadaver';

      expect(service.createUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});
