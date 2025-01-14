import { Module } from '@nestjs/common';
import { MiniClubController } from './mini-club.controller';
import { MiniClubService } from './mini-club.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MiniClubEntity } from './mini-club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiniClubEntity])],
  controllers: [MiniClubController],
  providers: [MiniClubService],
  exports: [TypeOrmModule],
})
export class MiniClubModule {}
