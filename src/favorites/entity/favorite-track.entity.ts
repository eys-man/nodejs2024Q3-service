import { Track } from '../../track/entity/track.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavoriteTrack {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  public favorite: Track;
}
