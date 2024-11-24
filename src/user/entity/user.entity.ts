import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @VersionColumn()
  version!: number;

  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: number;
  // createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: number;
  // updatedAt!: Date;
}
