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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/roles/entities/role.entity';
import { Roles } from 'src/decorator/rolesdecorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('getUser')
  findOne(@GetUserId() id: number) {
    return this.profilesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  update(
    @GetUserId() id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profilesService.update(+id, updateProfileDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@GetUserId() id: number) {
    return this.profilesService.remove(+id);
  }
}
