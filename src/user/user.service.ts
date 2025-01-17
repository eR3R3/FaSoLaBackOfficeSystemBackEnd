import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { userRole } from './user.enum';
import {ClubEntity} from "../club/club.entity";
import {PositionEntity} from "../position/position.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClubEntity)
    private readonly clubRepository: Repository<ClubEntity>,
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  async createUser(createUserInfo: Record<string, any>) {

    console.log(createUserInfo)

    const checkUser = await this.userRepository.findOne({where:{name: createUserInfo.name}})
    if(checkUser) return {message: "this user has already been created"}

    const user = this.userRepository.create({name : createUserInfo.name});
    const savedUser = await this.userRepository.save(user)

    if (createUserInfo.gender){
      savedUser.gender = createUserInfo.gender
    }

    if (createUserInfo.phone){
      savedUser.phone = createUserInfo.phone
    }

    if(createUserInfo.age){
      savedUser.age = createUserInfo.age
    }

    if(createUserInfo.position){
      createUserInfo.position = {name: createUserInfo.position}
      const position = await this.positionRepository.findOne({
        where: { name: createUserInfo.position.name },
      })
      if (position) {user.position = position}
      else {savedUser.position = createUserInfo.position}
    }

    if (createUserInfo.role){
      savedUser.role = createUserInfo.role
    }

    if(createUserInfo.adminClub) {
      createUserInfo.adminClub = {clubName: createUserInfo.adminClub}
      const adminClub = await this.clubRepository.findOne({
        where: {clubName: createUserInfo.adminClub.name},
      })
      if (adminClub) {
        savedUser.adminClub = adminClub
        await this.clubRepository.update({clubName: adminClub.clubName}, {admin: savedUser})
      } else {
        return {message: 'admin club not found'}
      }
    }

    if(createUserInfo.workingClub){
      createUserInfo.workingClub = {clubName: createUserInfo.workingClub}
      if(createUserInfo.leadingClub&&createUserInfo.adminClub){
        return {message: 'user cannot work in a club since he/she already is a leader or admin'}
      }
      const foundClub = await this.clubRepository.findOne({where: { clubName: createUserInfo.workingClub.clubName }})
      if (foundClub) {
        savedUser.workingClub = foundClub
        await this.clubRepository.update({clubName: foundClub.clubName}, {workers: foundClub.workers})
      }
      else {
        return {message: 'working club not found'}
      }
    }

    if(createUserInfo.leadingClub){
      createUserInfo.leadingClub = {clubName: createUserInfo.leadingClub}
      if(createUserInfo.leadingClub&&createUserInfo.adminClub){
        return {message: 'user cannot lead a club since he/she already is a worker or admin'}
      }
      const foundClub = await this.clubRepository.findOne({where: { clubName: createUserInfo.leadingClub.clubName }})
      if (foundClub) {
        savedUser.leadingClub = foundClub
        await this.clubRepository.update({clubName: foundClub.clubName}, {})
      }
    }

    if(createUserInfo.leadingMiniClub){
      createUserInfo.leadingMiniClub = {name: createUserInfo.leadingMiniClub}
      const foundClub = await this.clubRepository.findOne({where: { clubName: savedUser.workingClub.clubName||savedUser.leadingClub.clubName||savedUser.adminClub.clubName }})
      if(foundClub) {return {message:"no club found in field"}}
      const miniClubs = foundClub.miniClubs
      miniClubs.map(async (miniClub) => {
        if (miniClub.name === createUserInfo.leadingMiniClub.name) {
          miniClub.leader = [savedUser]
        }
      })
      await this.clubRepository.update({clubName: foundClub.clubName}, {miniClubs: miniClubs})
    }

    if (createUserInfo.workingMiniClub){
      createUserInfo.workingMiniClub = {name: createUserInfo.workingMiniClub}
      const foundClub = await this.clubRepository.findOne({where: { clubName: savedUser.workingClub.clubName||savedUser.leadingClub.clubName||savedUser.adminClub.clubName }})
      if(foundClub) {return {message: "no club found in field"}}
      const miniClubs = foundClub.miniClubs
      miniClubs.map(async (miniClub) => {
        if (miniClub.name === createUserInfo.workingMiniClub.name) {
          miniClub.workers = [savedUser]
        }
      })
      await this.clubRepository.update({clubName: foundClub.clubName}, {miniClubs: miniClubs})
    }
    return await this.userRepository.save(savedUser);
  }

  async findAllUsers() {
    console.log('find all users');
    return await this.userRepository.find({ relations: ['leadingMiniClub', 'adminClub', 'workingMiniClub', 'position', 'workingClub', 'leadingClub'] });
  }

  async deleteAll() {
    console.log('deleting all clubs');
    return await this.userRepository.delete({})
  }

  async deleteUserById(id: string) {
    console.log(id);
    return await this.userRepository.delete(id);
  }

  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async updateUserById(id: string, updateInfo: Record<string, any>) {
    return await this.userRepository.update({id}, updateInfo)
  }

  async adminUpgradeFromWorkerToLeader(adminId: string, workerId: string) {
    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    const worker = await this.userRepository.findOne({
      where: { id: workerId },
    });
    if (admin.role === 'admin' && worker.role === 'worker') {
      return await this.userRepository.update(workerId, {
        role: userRole.leader,
      });
    } else {
      throw new Error(
        'In adminUpgradeFromWorkerToLeader Not admin role or not worker role',
      );
    }
  }

  // async leaderCreateMiniClub(leaderId: string, miniClubName: string) {}

}
