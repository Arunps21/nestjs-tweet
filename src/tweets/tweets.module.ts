import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersGuard } from 'src/users/users.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), UsersModule],
  controllers: [TweetsController],
  providers: [TweetsService,UsersGuard],
  exports: [TweetsService],
})
export class TweetsModule {}
