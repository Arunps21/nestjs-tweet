import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}
  public async userReg(createUserDto: CreateUserDto) {
    const saltRounds: number = 10;
    const { username, email, password } = createUserDto;
    const extUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (extUser) {
      throw new ConflictException('User already exists');
    } else {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = this.usersRepository.create({
        username,
        email,
        password: hashedPassword,
      });
      await this.usersRepository.save(newUser);
      return newUser;
    }
  }


  public async userLogin(userLoginDto: LoginUserDto) {
    const {email, password} = userLoginDto;
    const user = await this.usersRepository.findOne({where: { email }});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return `Successfully logged in`;
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
