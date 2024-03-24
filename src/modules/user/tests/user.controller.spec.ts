import { Test } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto';
import { UserService } from '../user.service';
import { PrismaService } from '../../../prisma/prisma.service';

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

const userData: CreateUserDto = {
  name: 'Wojciech Wójcik',
  email: 'wojtek@mail.com',
  phone: '111222333',
  address: 'ul. Bielska 4/10',
  password: 'topSecretPwd',
};

const userPayload = {
  id: 2,
  email: 'damian@mail.com',
  phone: '123123123',
};

describe('User Controller', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [JwtService, UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('getUser', () => {
    it('should return a signle user', async () => {
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(fakeUsers[0]));
      expect(await userController.getUser(userPayload)).toBe(fakeUsers[0]);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(() => Promise.resolve(fakeUsers[0]));

      expect(await userController.createUser(userData)).toBe(fakeUsers[0]);
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      jest
        .spyOn(userService, 'signIn')
        .mockImplementation(() =>
          Promise.resolve({ access_token: 'VeryLongAccessToken' }),
        );

      expect(
        await userController.login({
          login: userData.email,
          password: userData.password,
        }),
      ).toEqual({
        access_token: 'VeryLongAccessToken',
      });
    });
  });
  describe('updateUser', () => {
    it('should return updated user', async () => {
      jest
        .spyOn(userService, 'updateUser')
        .mockImplementation(() => Promise.resolve(fakeUsers[0]));
      expect(
        await userController.updateUser({ name: 'New Name' }, userPayload),
      ).toBe(fakeUsers[0]);
    });
  });
  describe('removeUser', () => {
    it('should delete user and display successfull message', async () => {
      jest
        .spyOn(userService, 'deleteUser')
        .mockImplementation(() =>
          Promise.resolve({ message: 'User was deleted correctly' }),
        );
      expect(await userController.removeUser(userPayload)).toEqual({
        message: 'User was deleted correctly',
      });
    });
  });
});
