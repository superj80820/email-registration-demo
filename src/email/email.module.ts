import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '../config/config.service';
import { HttpModule } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  providers: [EmailService, ConfigService],
  exports: [EmailService],
})
export class EmailModule {}
