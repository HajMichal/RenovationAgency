import { Test } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const fakeUsers = [
  {
    id: 2,
    name: 'Damian Wójcik',
    email: 'damian@mail.com',
    phone: '123123123',
    address: 'ul. Kościuszki 4/10',
    password: '$2b$10$bB578qHx4dlxcPdXIp9Iburxv3uvk/qUgnOH.iBg7/N9ZZ.9opxa2',
    createdat: new Date('2024-03-21T16:03:12.869Z'),
    contractor: null,
    building: [],
  },
  {
    id: 3,
    name: 'Wojciech Wójcik',
    email: 'wojtek@mail.com',
    phone: '111222333',
    address: 'ul. Bielska 4/10',
    password: '$2b$10$bB578qHx4dlxcPdXIp9Iburxv3uvk/qUgnOH.iBg7/N9ZZ.9opxa2',
    createdat: new Date('2024-03-21T16:03:12.869Z'),
    contractor: null,
    building: [],
  },
];

const createUserData: CreateUserDto = {
  name: 'Wojciech Wójcik',
  email: 'testsss@gmail',
  phone: '999888999',
  address: 'ul. Bielska 4/10',
  password: 'topSecretPwd',
};

const prismaMock = {
  user: {
    findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
    findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
    create: jest.fn().mockReturnValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn(),
  },
};

describe('User Service', () => {
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getUser', () => {
    it('should return a signle user', async () => {
      const response = await userService.getUser(2);

      expect(response).toEqual(fakeUsers[0]);
      expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        include: {
          contractor: false,
          building: false,
        },
      });
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      jest.spyOn(userService, 'findFirstUser').mockResolvedValue(null);
      jest.spyOn(userService, 'hashPassword').mockResolvedValue('hashedPwd');

      const response = await userService.createUser(createUserData);

      expect(response).toEqual(fakeUsers[0]);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserData,
          password: 'hashedPwd',
        },
      });
    });

    it('should throw a ConflictException', () => {
      jest.spyOn(userService, 'findFirstUser').mockResolvedValue(fakeUsers[0]);
      const response = userService.createUser(createUserData);

      expect(async () => await response).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('should return access token', async () => {
      jest.spyOn(userService, 'findFirstUser').mockResolvedValue(fakeUsers[0]);
      jest.spyOn(bcrypt, 'compareSync').mockResolvedValue(true);

      const response = await userService.signIn({
        login: createUserData.email,
        password: createUserData.password,
      });
      expect(response).toBeTruthy();
    });
    it('should throw UnauthorizedException', () => {
      jest.spyOn(userService, 'findFirstUser').mockResolvedValue(null);
      const response = userService.signIn({
        login: createUserData.email,
        password: createUserData.password,
      });
      expect(async () => await response).rejects.toThrow(UnauthorizedException);
    });

    describe('updateUser', () => {
      it('should return updated user', async () => {
        jest.spyOn(userService, 'findFirstUser').mockResolvedValue(null);
        jest.spyOn(userService, 'hashPassword').mockResolvedValue('hashedPwd');

        const response = await userService.updateUser(createUserData, 2);

        expect(prisma.user.update).toHaveBeenCalledTimes(1);
        expect(prisma.user.update).toHaveBeenCalledWith({
          where: {
            id: 2,
          },
          data: {
            ...createUserData,
            password: 'hashedPwd',
          },
        });
        expect(response).toBe(fakeUsers[0]);
      });
    });

    describe('deleteUser', () => {
      it('should return successful message', async () => {
        const response = await userService.deleteUser(2);

        expect(prisma.user.delete).toHaveBeenCalledTimes(1);
        expect(prisma.user.delete).toHaveBeenCalledWith({
          where: {
            id: 2,
          },
        });
        expect(response).toEqual({ message: 'User was deleted correctly' });
      });
    });
  });
});
