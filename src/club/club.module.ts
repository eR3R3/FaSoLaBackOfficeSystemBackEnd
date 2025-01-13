import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { MiniClubModule } from '../mini-club/mini-club.module';
import { UserModule } from '../user/user.module';
import {PositionModule} from "../position/position.module";

@Module({
  imports: [TypeOrmModule.forFeature([ClubEntity]), UserModule, MiniClubModule, PositionModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
