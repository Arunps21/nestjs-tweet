import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tweet } from './entities/tweet.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    private readonly usersService: UsersService,
  ) {}
  public async create(createTweetDto: CreateTweetDto, id: number) {
    const { content } = createTweetDto;
    await this.usersService.findOne(id);
    const tweet = this.tweetRepository.create({
      content,
      user_id: id,
    });
    return await this.tweetRepository.save(tweet);
  }

  findAll() {
    return this.tweetRepository.find();
  }

  public async findOne(id: number) {
    const tweet = await this.tweetRepository.find({
      where: {
        user_id: id,
      },
    });
    if (!tweet) {
      throw new ConflictException(`Tweet with id ${id} not found`);
    }
    return tweet;
  }

  public async update(id: number, updateTweetDto: UpdateTweetDto) {
    const tweet = await this.findOne(id);
    if (!tweet) {
      throw new ConflictException(`Tweet with id ${id} not found`);
    }
    const updateTweet = await this.tweetRepository.update(
     id,
      updateTweetDto,
    );
    if (!updateTweet.affected) {
      throw new ConflictException(`Tweet with id ${id} not updated`);
    }
    return this.tweetRepository.findOne({ where: { user_id: id } });
  }

  public async remove(id: number) {
    const tweet = await this.findOne(id);
    if (!tweet) {
      throw new ConflictException(`Tweet with id ${id} not found`);
    }
    await this.tweetRepository.delete(id);
    return this.findAll();
  }
}
