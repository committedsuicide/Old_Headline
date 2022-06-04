import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity()
export class PhraseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phrase: string;
  @Column()
  transcription: string;
  @Column()
  translation: string;
  @ManyToOne(() => CategoryEntity, (category) => category.phrases)
  category: CategoryEntity;
  @Column()
  soundId: number;
}
