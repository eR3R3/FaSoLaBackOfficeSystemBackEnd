import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { ClubEntity } from "../club/club.entity";

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  name: string;

  @OneToMany(()=>UserEntity, (user) => user.position)
  users: UserEntity[];

  @ManyToOne(() => ClubEntity, (club) => club.positions)
  club: ClubEntity;
}