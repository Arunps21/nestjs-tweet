import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tweet_id: number;

  @ManyToOne(() => Tweet, (tweet) => tweet.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'tweet_id' })
  tweet: Tweet;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
