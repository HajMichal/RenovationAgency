import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ZodValidationPipe } from 'src/zod/ZodValidationPipe';
import { createUserSchema, loginSchema } from './schema';
import { LoginDto, CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post('/signup')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() createUserData: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(createUserData);
  }

  @Post('/signin')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() loginData: LoginDto) {
    return this.userService.signIn(loginData);
  }
}
