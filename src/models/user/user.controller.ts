import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Public } from 'src/common/auth/auth.guard';
import { UserService } from './user.service';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { CreateUserDto, LoginDto, UpdateDto } from './dto';
import { createUserSchema, loginSchema, updateSchema } from './schemas';
import { User } from '@prisma/client';
import { user } from 'src/common/constatns/modelsEndpoints';
import { idMatchInterceptor } from 'src/common/interceptors';

@Controller(user)
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.getUser(id);
  }

  // Public is custom decorator, enables hit this endpoint by not authenticated users
  @Public()
  @Post('/signup')
  // This line is validating is data is provided in correct structure,
  // if no the error is sending immediately
  @UsePipes(new DataValidationPipe(createUserSchema))
  createUser(@Body() createUserData: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(createUserData);
  }

  @Public()
  @Post('/signin')
  @UsePipes(new DataValidationPipe(loginSchema))
  login(@Body() loginData: LoginDto) {
    return this.userService.signIn(loginData);
  }

  @Patch('/update')
  @UsePipes(new DataValidationPipe(updateSchema))
  @UseInterceptors(idMatchInterceptor)
  updateUser(@Body() userData: UpdateDto) {
    return this.userService.updateUser(userData);
  }

  @Delete('/remove/:id')
  @UseInterceptors(idMatchInterceptor)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
