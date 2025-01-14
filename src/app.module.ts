import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { ClubModule } from './club/club.module';
import { ClubEntity } from './club/club.entity';
import { MiniClubModule } from './mini-club/mini-club.module';
import { PositionModule } from './position/position.module';
import {PositionEntity} from "./position/position.entity";
import {MiniClubEntity} from "./mini-club/mini-club.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '123',
      database: 'nestjs',
      entities: [UserEntity, ClubEntity, PositionEntity, MiniClubEntity],
      synchronize: true,
    }),
    UserModule,
    ClubModule,
    MiniClubModule,
    PositionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
