import { Exclude } from 'class-transformer';
import { Artist } from 'src/artist/entity/artist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null;

  @OneToOne(() => Artist, { onDelete: 'SET NULL' })
  @JoinColumn()
  artist: Artist;

  @Exclude()
  @Column({ default: false, select: false} )
  isFavorite: boolean;
}
