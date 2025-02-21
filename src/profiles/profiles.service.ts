import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
  ) {}

  public async create(createProfileDto: CreateProfileDto) {
    const { user_id, avatar, bio } = createProfileDto;
    await this.userService.findOne(user_id);
    const extProfile = await this.profilesRepository.findOneBy({ user_id });
    if (extProfile) {
      throw new ConflictException('Profile already exists for this user');
    }
    const profile = this.profilesRepository.create({
      user_id,
      avatar,
      bio,
    });
    await this.profilesRepository.save(profile);
    return await this.profilesRepository.find();
  }

  public async findAll() {
    return this.profilesRepository.find();
  }

  public async findOne(id: number) {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new ConflictException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  public async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new ConflictException(`Profile with id ${id} not found`);
    }
    await this.profilesRepository.update(id, updateProfileDto);
    return await this.profilesRepository.findOne({ where: { id } });
  }

  public async remove(id: number) {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new ConflictException(`Profile with id ${id} not found`);
    }
    await this.profilesRepository.delete(id);
    return this.profilesRepository.find();
  }
}
