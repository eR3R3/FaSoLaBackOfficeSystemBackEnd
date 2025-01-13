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
// import {QuestionnaireEntity} from "../questionnaire/questionnaire.entity";
//
// @Entity()
// export class MiniQuestionnaireEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @ManyToMany(()=>QuestionEntity, question=>question.miniQuestionnaire)
//   questions:
//
//   @ManyToMany(()=>QuestionnaireEntity, questionnaire=>questionnaire.miniQuestionnaire)
//   questionnaires:QuestionnaireEntity[];
//
//   @Column('float')
//   weight: number;
// }