import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhraseEntity } from './phrase.entity';

@Entity()
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  categoryName: string;

  @OneToMany(() => PhraseEntity, (phrase) => phrase.category)
  phrases: PhraseEntity[];
}
