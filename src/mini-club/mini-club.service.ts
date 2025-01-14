import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MiniClubEntity } from './mini-club.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MiniClubService {
  constructor(
    @InjectRepository(MiniClubEntity)
    private miniClubRepository: Repository<MiniClubEntity>,
  ) {}

  async findAllMiniClubs() {
    return await this.miniClubRepository.find({ relations: ['club', 'leader', "workers"] });
  }

  async findOneMiniClub(id: string) {
    return await this.miniClubRepository.findOneBy({ id });
  }

  async deleteAll(){
    return await this.miniClubRepository.delete({});
  }
}
