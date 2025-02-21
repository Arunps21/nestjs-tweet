import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweet_id: number;

  @ManyToOne(() => Tweet, (tweet) => tweet.id, { onDelete: 'CASCADE' })
  tweet: Tweet;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
