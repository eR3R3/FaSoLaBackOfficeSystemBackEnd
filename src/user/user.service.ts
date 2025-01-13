import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { userRole } from './user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(body: Record<string, any>) {
    console.log(body);
    const user = this.userRepository.create(body);
    return await this.userRepository.save(user);
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
