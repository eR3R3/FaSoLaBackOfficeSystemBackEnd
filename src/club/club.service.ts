import {Injectable} from "@nestjs/common";
import {ClubEntity} from "./club.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/user.entity";
import {Repository} from "typeorm";
import {PositionEntity} from "../position/position.entity";
import {MiniClubEntity} from "../mini-club/mini-club.entity";
import {userRole} from "../user/user.enum";

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MiniClubEntity)
    private readonly miniClubRepository: Repository<MiniClubEntity>,
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
  ) {}

  async createClub(createClubInfo: Record<string, any>) {
    console.log(createClubInfo);
    const basicClubInfo = {
      clubName: createClubInfo.clubName,
    }
    const club = this.clubRepository.create(basicClubInfo);
    const savedClub = await this.clubRepository.save(club);

    if (createClubInfo.admin) {
      if(!createClubInfo.admin){
        await this.clubRepository.delete({clubName:createClubInfo.clubName})
        return {message:"admin name cannot be empty string"}
      }
      const admin = await this.userRepository.findOne({where: { name: createClubInfo.admin.name }});
      const foundPosition = await this.positionRepository.findOne({where: { name: createClubInfo.clubName+"部长" }})
      if (admin) {
        admin.role = userRole.admin
        if(foundPosition){admin.position = foundPosition}
        else{
          // @ts-ignore
          admin.position = {name: createClubInfo.clubName+"部长"}
        }
        savedClub.admin = admin;
      } else {
        if(foundPosition){
          createClubInfo.admin.position = foundPosition
        }
        else{createClubInfo.admin.position = {name: createClubInfo.clubName+"部长"}}
        createClubInfo.admin.role = userRole.admin;
        savedClub.admin = createClubInfo.admin
      }
    }


    if (createClubInfo.positions) {
      // for (const position of createClubInfo.positions) {
      //   if (position.users) {
      //     const updatedUsers = [];
      //     for (const user of position.users) {
      //       const foundUser = await this.userRepository.findOne({
      //         where: { name: user.name },
      //       });
      //       updatedUsers.push(foundUser || user);
      //     }
      //     position.users = updatedUsers; // 更新 users 数据
      //   }
      // }
      for (let i = 0; i < createClubInfo.positions.length; i++) {
        const position = createClubInfo.positions[i];
        const foundPosition = await this.positionRepository.findOne({
          where: { name: position.name },
        });

        if (foundPosition) {
          createClubInfo.positions[i] = foundPosition; // 确保更新数组中的值
        }
      }

      savedClub.positions = createClubInfo.positions;
      await this.clubRepository.save(savedClub);
    }

    if (createClubInfo.leaders) {
      const updatedLeaders = []
      for(const leader of createClubInfo.leaders) {
        const foundLeader = await this.userRepository.findOne({where:{name: leader.name}});
        const foundPosition = await this.positionRepository.findOne({where:{name: leader.position.name}});
        if (foundLeader) {
          if(foundPosition) {
            foundLeader.position = foundPosition
          }
          else{
            foundLeader.position = leader.position
          }
          foundLeader.role = userRole.leader
          updatedLeaders.push(foundLeader);
        }
        else{
          if(foundPosition) {
            leader.position = foundPosition
          }
          leader.role = userRole.leader
          updatedLeaders.push(leader);
        }
      }
      savedClub.leaders = updatedLeaders;
      await this.clubRepository.save(savedClub);
    }

    if (createClubInfo.workers) {
      const updatedWorkers = []
      for(const worker of createClubInfo.workers) {
        const foundWorker = await this.userRepository.findOne({where:{name: worker.name}});
        const foundPosition = await this.positionRepository.findOne({where:{name: worker.position.name}});
        if (foundWorker) {
          if(foundPosition) {
            foundWorker.position = foundPosition
          }
          else{
            foundWorker.position =worker.position
          }
          updatedWorkers.push(foundWorker);
        }
        else{
          if(foundPosition) {
            worker.position = foundPosition
          }
          updatedWorkers.push(worker);
        }
      }
      savedClub.workers = updatedWorkers;
      await this.clubRepository.save(savedClub);
    }

    if (createClubInfo.miniClubs) {
      for (const miniClub of createClubInfo.miniClubs) {
        if (miniClub.workers) {
          const updatedWorkers = [];
          for (const worker of miniClub.workers) {
            const foundWorker = await this.userRepository.findOne({
              where: { name: worker.name },
            });
            if(foundWorker) {
              foundWorker.position = worker.position;
              updatedWorkers.push(foundWorker);
            }
            else{
              updatedWorkers.push(worker);
            }
          }
          miniClub.workers = updatedWorkers
        }

        if (miniClub.leader) {
          const updatedLeader = [];
          for (const leader of miniClub.leader) {
            const foundLeader = await this.userRepository.findOne({
              where: { name: leader.name },
            });
            if(foundLeader) {
              foundLeader.position = leader.position;
              updatedLeader.push(foundLeader);
            }
            else{
              updatedLeader.push(leader);
            }
          }
          miniClub.leader = updatedLeader;
        }
      }
      savedClub.miniClubs = createClubInfo.miniClubs;
    }
    try {
      console.log("before save:", savedClub)
      return await this.clubRepository.save(savedClub);
    } catch (error) {
      throw new Error(`Failed to create club: ${error.message}`);
    }
  }

  async findAllClub() {
    console.log('find all clubs');
    return await this.clubRepository.find({ relations: ['admin', 'miniClubs', 'positions', 'leaders', 'workers', 'miniClubs.leader', 'miniClubs.workers'] });
  }

  async deleteClubByClubName(clubName: string) {
    console.log('deleting club');
    return await this.clubRepository.delete({clubName: clubName});
  }

  async updateClub(id: string, updateInfo: Record<string, any>) {
    console.log('updating club');
    return await this.clubRepository.update({id}, updateInfo);
  }

  async findClubByClubName(clubName: string) {
    return await this.clubRepository.findOne({where:{clubName: clubName}, relations: ['miniClubs', 'miniClubs.leader', 'miniClubs.workers', 'admin',
        'leaders', 'workers', 'workers.position', 'leaders.position', 'leaders.leadingMiniClub',
        'workers.workingMiniClub', 'miniClubs.leader.position', 'miniClubs.workers.position', 'miniClubs.leader.leadingMiniClub',
        'miniClubs.workers.workingMiniClub', 'admin.position'] });
  }

  async deleteClub(id: string) {
    console.log('deleting club');
    return await this.clubRepository.delete(id);
  }

  async deleteAll() {
    console.log('deleting all clubs');
    return await this.clubRepository.delete({})
  }

  async deletePosition(deletePosition: string[]){
    console.log('deleting position');
    deletePosition.map(async (each: string) => {
      const position = await this.positionRepository.findOne({ where: { name: each } })
      await this.clubRepository.delete({ positions: position });
    })
  }
}
