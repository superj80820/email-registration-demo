import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '../config/config.service';
import { EmailModule } from '../email/email.module';
import { PhoneModule } from '../phone/phone.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule, PhoneModule],
  providers: [UsersService, ConfigService],
  controllers: [UsersController],
})
export class UsersModule {}
