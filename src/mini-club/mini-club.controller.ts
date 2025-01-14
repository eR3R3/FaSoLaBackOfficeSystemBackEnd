import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {MiniClubService} from "./mini-club.service";

@Controller('api/miniClubs')
export class MiniClubController {
  constructor(private readonly miniClubService: MiniClubService) {
  }

  @Delete('deleteAll')
  async deleteAll() {
    return await this.miniClubService.deleteAll();
  }

  @Get('fetchAll')
  async fetchAll() {
    return await this.miniClubService.findAllMiniClubs()
  }
}
