import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionEntity } from "./position.entity";
import {PositionController} from "./position.controller";
import {PositionService} from "./position.service";


@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionController],
  providers: [PositionService],
  exports: [TypeOrmModule],
})
export class PositionModule {}
