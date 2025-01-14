import {
  Column,
  Entity,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { userRole } from './user.enum';
import { MiniClubEntity } from '../mini-club/mini-club.entity';
import { PositionEntity } from "../position/position.entity";

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  age: number;

  @OneToOne(()=>ClubEntity, club=>club.admin)
  adminClub: ClubEntity;

  @ManyToOne(() => ClubEntity, (club) => club.leaders)
  leadingClub: ClubEntity;

  @ManyToOne(() => PositionEntity, (position) => position.users, { cascade: true, onDelete: 'SET NULL' })
  position: PositionEntity;

  @ManyToOne(() => MiniClubEntity, (miniClub) => miniClub.leader)
  leadingMiniClub: MiniClubEntity[];

  @ManyToOne(() => ClubEntity, (club) => club.workers)
  workingClub: ClubEntity;

  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.worker
  })
  role: userRole;

  @ManyToOne(() => MiniClubEntity, (miniClub) => miniClub.workers)
  workingMiniClub: MiniClubEntity;

  @Column({ nullable: true })
  password: string;
}