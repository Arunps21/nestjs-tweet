import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { GetUserId } from 'src/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTweetDto: CreateTweetDto, @GetUserId() id: number) {
    return this.tweetsService.create(createTweetDto, id);
  }

  @Get()
  findAll() {
    return this.tweetsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getTweet')
  findOne(@GetUserId() id: number) {
    return this.tweetsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTweetDto: UpdateTweetDto) {
    return this.tweetsService.update(+id, updateTweetDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`:id`)
  remove(@Param('id') id: number) {
    return this.tweetsService.remove(+id);
  }
}
