import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  private JWTSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    configService: ConfigService,
  ) {
    this.JWTSecret = configService.get('JWT_SECRET');
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.password = crypto
      .createHmac('sha256', this.JWTSecret)
      .update(createUserDto.password)
      .digest('hex');
    user.phoneNumber = createUserDto.phoneNumber;
    user.name = createUserDto.name;

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
