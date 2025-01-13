import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PositionEntity } from "./position.entity";

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ){}

  async createPosition(positionInfo: Partial<PositionEntity>){
    return this.positionRepository.create(positionInfo);
  }

  async findAllPositions(){
    return await this.positionRepository.find({relations: ['club', 'users']});
  }

  async deletePosition(positionName:string){
    return await this.positionRepository.delete({ name: positionName });
  }

  async deleteAll(){
    return await this.positionRepository.delete({});
  }
}