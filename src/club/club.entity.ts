import {
  Column,
  Entity, JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { MiniClubEntity } from '../mini-club/mini-club.entity';
import { PositionEntity } from "../position/position.entity";

@Entity('club')
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true})
  clubName: string;

  @OneToOne(() => UserEntity, user=>user.adminClub, {cascade: true, nullable: true , onDelete: 'SET NULL'})
  @JoinColumn()
  admin: UserEntity;

  @OneToMany(()=>UserEntity, user=>user.leadingClub, {cascade: true, onDelete: 'SET NULL'})
  leaders: UserEntity[];

  @OneToMany(()=>UserEntity, user=> user.workingClub, {cascade: true, onDelete: 'SET NULL'})
  workers: UserEntity[];

  @OneToMany(() => MiniClubEntity, (miniClub) => miniClub.club, { cascade: true, onDelete: 'SET NULL'})
  miniClubs: MiniClubEntity[];

  @OneToMany(() => PositionEntity, (position) => position.club, { cascade: true, onDelete: 'SET NULL' })
  positions: PositionEntity[];
}