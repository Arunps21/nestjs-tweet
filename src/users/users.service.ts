import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  public async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto;
    const extUser = await this.usersRepository.findOneBy({ email });
    if (extUser) {
      throw new ConflictException('User already exists');
    } else {
      const newUser = this.usersRepository.create({
        username,
        email,
        password,
      });
      await this.usersRepository.save(newUser);
      return newUser;
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  public async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  public async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
    return this.findAll();
  }
}
