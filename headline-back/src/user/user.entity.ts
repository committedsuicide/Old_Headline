import {
  BaseEntity,
  Column,
  Entity, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../phrase/category.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  vkId: string;

  @Column({ default: 'free' })
  tariff: string;

  @Column({ default: 'user' })
  role: string
  @ManyToMany((type) => CategoryEntity, {
    cascade: true
  })
  @JoinTable()
  categories: CategoryEntity[];
}
