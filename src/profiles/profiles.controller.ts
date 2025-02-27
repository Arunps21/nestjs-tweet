import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { GetUserId } from 'src/decorator/user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  create(
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUserId() user: number,
  ) {
    return this.profilesService.create(createProfileDto, file, user);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get('getUser')
  findOne(@GetUserId() id: number) {
    return this.profilesService.findOne(+id);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  update(
    @GetUserId() id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(+id, updateProfileDto, file);
  }

  @Delete()
  remove(@GetUserId() id: number) {
    return this.profilesService.remove(+id);
  }
}
