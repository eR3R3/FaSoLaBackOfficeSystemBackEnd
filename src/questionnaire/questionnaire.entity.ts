// import {
//   Column,
//   Entity,
//   ManyToMany,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { ClubEntity } from '../club/club.entity';
// import { MiniClubEntity } from '../mini-club/mini-club.entity';
// import { PositionEntity } from "../position/position.entity";
// import {MiniQuestionnaireEntity} from "../mini-questionnaire/mini-questionnaire.entity";
//
// @Entity()
// export class QuestionnaireEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @ManyToMany(()=>MiniQuestionnaireEntity, miniQuestionnaire=>miniQuestionnaire.questionnaire)
// }