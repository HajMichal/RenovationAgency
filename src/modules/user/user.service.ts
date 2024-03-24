import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, LoginDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async getUser(
    id: number,
    includeBuilding?: boolean,
    includeContractor?: boolean,
  ) {
    if (!id) throw new NotFoundException('User not found');
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        building: includeBuilding ?? false,
        contractor: includeContractor ?? false,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const user = await this.findFirstUser(data.email, data.phone);

    if (user)
      throw new ConflictException(
        'User with this Email or Phone number already exists',
      );

    const hashedPassword = await this.hashPassword(data.password);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async signIn({ login, password }: LoginDto) {
    const user = await this.findFirstUser(login, login);
    if (!user) throw new UnauthorizedException('Incorrect data');

    const isPwdCorrect = bcrypt.compareSync(password, user.password);
    if (!isPwdCorrect) throw new UnauthorizedException('Incorrect data');

    const payload = { id: user.id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
      }),
    };
  }

  async updateUser(data: UpdateUserDto, userId: number) {
    const user = await this.findFirstUser(data?.email, data?.phone);

    if (user)
      throw new ConflictException('This Email or Phone number is taken');

    const hashedPassword = await this.hashPassword(data.password);
    const updatedUser = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: data.address,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
    });
    return updatedUser;
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return { message: 'User was deleted correctly' };
  }

  async hashPassword(password: string | undefined) {
    const salt = await bcrypt.genSalt();
    if (password) return await bcrypt.hash(password, salt);
  }

  async findFirstUser(email?: string, phone?: string) {
    return await this.prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });
  }
}
