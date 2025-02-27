import {
  ConflictException,
  HttpStatus,
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
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  public async userReg(createUserDto: CreateUserDto) {
    const saltRounds: number = 10;
    const { username, email, password, role_id } = createUserDto;
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
        role_id
      });
      await this.usersRepository.save(newUser);
      return newUser;
    }
  }

  public async userLogin(userLoginDto: LoginUserDto) {
    const { email, password } = userLoginDto;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.id, email: user.email , roleId : user.role };

    console.log(user.role.role);
    const token = this.jwtService.sign(payload);
    return {
      message: `Successfully logged In`,
      statusCode: HttpStatus.OK,
      token,
      user,
    };
  }

  findAll(skip: number, limit: number) {
    return this.usersRepository.find({
      skip,
      take: limit,
    });
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
    return this.usersRepository.find();
  }
}
