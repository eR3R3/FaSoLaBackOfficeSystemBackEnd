import {Body, Controller, Delete, Get, Post} from '@nestjs/common';
import {ClubService} from './club.service';

@Controller('api/clubs')
export class ClubController {
  constructor(private clubService: ClubService) {}

  @Post('create')
  async createClub(@Body() body: Record<string, any>) {
    return await this.clubService.createClub(body)
  }

  @Get('fetchAll')
  async findAllClub() {
    return await this.clubService.findAllClub();
  }

  @Post('update')
  async updateClub(@Body() body: Record<string, any>) {
    const id: string = body.id
    const updateInfo: Record<string, any> = body.updateInfo
    return await this.clubService.updateClub(id, updateInfo)
  }

  @Post("findClub")
  async findClubs(@Body() body: Record<string, any>) {
    return this.clubService.findClubByClubName(body.clubName)
  }

  @Delete('deleteAll')
  async deleteAllClub() {
    return await this.clubService.deleteAll()
  }

  @Post('delete')
  async deleteClub(@Body() body: string) {
    return await this.clubService.deleteClub(body)
  }
}
