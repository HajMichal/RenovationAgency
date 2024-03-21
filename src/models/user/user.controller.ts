import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  CreateUserDto,
  createUserSchema,
  LoginDto,
  loginSchema,
  updateSchema,
  UpdateUserDto,
  UserDto,
} from './dto';
import { Public } from 'src/common/auth/auth.guard';
import { UserService } from './user.service';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { User as UserDataType } from '@prisma/client';
import { user } from 'src/common/constatns/modelsEndpoints';
import { User } from 'src/common/decorators';

@Controller(user)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(@User() user: UserDto): Promise<UserDataType | null> {
    return this.userService.getUser(user.id);
  }

  // Public is custom decorator, enables hit this endpoint by not authenticated users
  @Public()
  @Post('signup')
  // This line checks is data provided in correct structure,
  // if no, the error is sending immediately
  @UsePipes(new DataValidationPipe(createUserSchema))
  createUser(@Body() createUserData: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(createUserData);
  }

  @Public()
  @Post('signin')
  @UsePipes(new DataValidationPipe(loginSchema))
  login(@Body() loginData: LoginDto) {
    return this.userService.signIn(loginData);
  }

  @Patch('update')
  updateUser(
    @Body(new DataValidationPipe(updateSchema)) userData: UpdateUserDto,
    @User() user: UserDto,
  ) {
    return this.userService.updateUser(userData, user.id);
  }

  @Delete('remove/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
