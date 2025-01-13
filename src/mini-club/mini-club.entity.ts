import { ClubEntity } from 'src/club/club.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity, JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity('mini-club')
export class MiniClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ClubEntity, (club) => club.miniClubs)
  club: ClubEntity;

  @OneToMany(() => UserEntity, (user) => user.workingMiniClub, {cascade: true, onDelete: 'SET NULL'})
  workers: UserEntity[];

  @OneToMany(() => UserEntity, user=>user.leadingMiniClub, {cascade: true, onDelete: 'SET NULL'})
  leader: UserEntity[];
}
