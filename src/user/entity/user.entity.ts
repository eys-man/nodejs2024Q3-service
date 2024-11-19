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
  public id: string;

  @Column({ unique: true })
  public login: string;

  @Column()
  public password: string;

  @VersionColumn()
  public version: number;

  @CreateDateColumn()
  public createdAt: number;

  @UpdateDateColumn()
  public updatedAt: number;
}
