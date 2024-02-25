import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createUser(data: CreateUserDto) {
    const isUserExists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { phone: data.phone }] },
    });

    if (isUserExists)
      throw new ConflictException(
        'User with this Email or Phone number already exists',
      );

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async signIn({ login, password }: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { phone: login }],
      },
    });
    if (!user) throw new UnauthorizedException('Incorrect data');

    const isPwdCorrect = bcrypt.compareSync(password, user.password);
    if (!isPwdCorrect) throw new UnauthorizedException('Incorrect data');

    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
      }),
    };
  }
}
