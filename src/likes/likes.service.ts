import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { TweetsService } from 'src/tweets/tweets.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    private readonly tweetService: TweetsService,
    private readonly userService: UsersService,
  ) {}
  public async create(createLikeDto: CreateLikeDto) {
    const { tweet_id, user_id } = createLikeDto;
    await this.tweetService.findOne(tweet_id);
    await this.userService.findOne(user_id);
    const like = await this.likeRepository.findOneBy({ user_id });
    if (like) {
      throw new ConflictException('Like already exists for this user');
    }
    const newLike = this.likeRepository.create({
      tweet_id,
      user_id,
    });
    await this.likeRepository.save(newLike);
    return await this.likeRepository.find();
  }

  findAll() {
    return this.likeRepository.find();
  }

  public async findOne(id: number) {
    const like = await this.likeRepository.findOne({ where: { id } });
    if (!like) {
      throw new ConflictException(`Like with id ${id} not found`);
    }
    return like;
  }

  public async update(id: number, updateLikeDto: UpdateLikeDto) {
    const like = await this.likeRepository.findOne({ where: { id } });
    if (!like) {
      throw new ConflictException(`Like with id ${id} not found`);
    }
    await this.likeRepository.update(id, updateLikeDto);
    return await this.likeRepository.findOne({ where: { id } });
  }

  public async remove(id: number) {
    const like = await this.likeRepository.findOne({ where: { id } });
    if (!like) {
      throw new ConflictException(`Like with id ${id} not found`);
    }
    await this.likeRepository.delete(id);
    return this.likeRepository.find();
  }
}
