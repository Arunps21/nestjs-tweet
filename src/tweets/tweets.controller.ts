import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { UsersGuard } from 'src/users/users.guard';
import { GetUserId } from 'src/decorator/user.decorator';

@UseGuards(UsersGuard)
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  create(@Body() createTweetDto: CreateTweetDto, @GetUserId() id : number) {
    return this.tweetsService.create(createTweetDto,id);
  }

  @Get()
  findAll() {
    return this.tweetsService.findAll();
  }

  @Get('getTweet')
  findOne(@GetUserId() id: number) {
    return this.tweetsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @Delete(`:id`)
  remove(@Param('id') id: number) {
    return this.tweetsService.remove(+id);
  }
}
