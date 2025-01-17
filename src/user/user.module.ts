import { TypeOrmModule } from '@nestjs/typeorm';
import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import {ClubModule} from "../club/club.module";
import {PositionModule} from "../position/position.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => ClubModule), PositionModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
