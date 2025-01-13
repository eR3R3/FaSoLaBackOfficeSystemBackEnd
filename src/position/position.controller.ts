import {Body, Controller, Delete, Get, Post} from "@nestjs/common";
import { PositionService } from "./position.service";
import { PositionEntity } from "./position.entity";

// @ts-ignore
@Controller("api/positions")
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Post('create') async createPosition(@Body() positionInfo: PositionEntity) {
    return await this.positionService.createPosition(positionInfo);
  }

  @Post('delete') async deletePosition(@Body() positionName: string) {
    return await this.positionService.deletePosition(positionName);
  }

  @Delete('deleteAll') async deleteAll() {
    return await this.positionService.deleteAll();
  }

  @Get('fetchAll') async getAll() {
    return await this.positionService.findAllPositions()
  }
}