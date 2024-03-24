import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserService } from './user.service';
import { DataValidationPipe } from '../../common/pipes/validateData.pipe';
import { User as IUser } from '@prisma/client';
import { user as userEndpoint } from '../../common/constatns/modelsEndpoints';
import { User } from '../../common/decorators';
import { Public } from '../../common/decorators/public.decorator';

@Controller(userEndpoint)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(@User() user: UserDto): Promise<IUser | null> {
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

  @Delete('remove')
  removeUser(@User() user: UserDto) {
    return this.userService.deleteUser(user.id);
  }
}
