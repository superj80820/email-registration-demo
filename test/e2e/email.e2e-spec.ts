import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../src/email/email.service';
import { ConfigService } from '../../src/config/config.service';
import { HttpModule } from '@nestjs/common';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [EmailService, ConfigService],
    }).compile();

    emailService = app.get<EmailService>(EmailService);
  });

  describe('sendEmail', () => {
    it('should get "Hello World!" in email box', async () => {
      await emailService.sendEmail(
        'Test Subject',
        'Hello World!',
        'superj80820@gmail.com',
      );
    });
  });
});
