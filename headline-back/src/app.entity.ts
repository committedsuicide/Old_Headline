import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AppEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image_url: string;

  @Column()
  button_text: string;

  @Column()
  button_url: string;

  @Column()
  title: string;
}
