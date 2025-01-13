import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

interface CreateUserInterface {
  username: string;
  password: string;
  clubs: string[];
  email: string;
}

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('fetchAll')
  async fetchAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Post('delete')
  async deleteUser(@Body() body: Record<string, any>) {
    const { id } = body;
    return await this.userService.deleteUserById(id);
  }

  @Post('create')
  async createUser(@Body() body: CreateUserInterface) {
    return await this.userService.createUser(body);
  }

  @Post('update')
  async updateUser(@Body() body: Record<string, any>) {
    const id: string = body.id;
    const updateInfo: Record<string, any> = body.updateInfo
    return this.userService.updateUserById(id, updateInfo);
  }

  @Post('find')
  async findOneUser(@Body() body: Record<string, any>) {
    console.log(body.id);
    return await this.userService.getUserById(body.id);
  }

  @Delete('deleteAll')
  async deleteAll() {
    return await this.userService.deleteAll()
  }
}
