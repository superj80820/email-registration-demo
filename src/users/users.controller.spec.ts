import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '../config/config.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { I18NService } from '../i18n/i18n.service';
import { PhoneService } from '../phone/phone.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { HttpModule } from '@nestjs/common';

describe('create', () => {
  let usersController: UsersController;
  let emailService: EmailService;
  let usersService: UsersService;
  let configService: ConfigService;
  let phoneService: PhoneService;
  let i18nService: I18NService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        EmailService,
        UsersService,
        ConfigService,
        PhoneService,
        I18NService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      controllers: [UsersController],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    emailService = app.get<EmailService>(EmailService);
    usersService = app.get<UsersService>(UsersService);
    configService = app.get<ConfigService>(ConfigService);
    phoneService = app.get<PhoneService>(PhoneService);
    i18nService = app.get<I18NService>(I18NService);

    jest
      .spyOn(i18nService, 'getMessage')
      .mockImplementation((messageKey: string) => {
        return {
          errorArgs: '未帶需要的參數',
          errorEmailFormat: 'Email 格式錯誤',
          errorPhoneNumberFormat: '電話格式錯誤',
          errorLessthanSpec8Number: '密碼少於8個字元',
          errorPassordEqulConfirmPassword: '確認密碼不正確',
          errorEmailExist: 'Email已被使用',
          errorPhoneNumberExist: '手機已被使用',
          welcome: '您好！ 歡迎加入 AmazingTalker',
        }[messageKey];
      });

    jest.spyOn(configService, 'get').mockImplementation(
      (key) =>
        ({
          SENDGRID_TOKEN: 'asdf',
          FROM_EMAIL: 'asdf',
          JWT_SECRET: 'asdf',
          HASH_SECRET: 'asdf',
        }[key]),
    );
  });

  describe('validator', () => {
    it('should return "未帶需要的參數"', async () => {
      const request: CreateUserDto = {
        name: 'york',
        email: 'asdf',
        password: '1234567890',
        confirmPassword: '1234567890',
        phoneNumber: '0912345678',
        locale: 'zh-TW',
      };
      request.email = undefined;
      request.phoneNumber = undefined;
      try {
        await usersController.create(request);
      } catch (err) {
        expect(err.response.error_message).toBe('未帶需要的參數');
        expect(err.status).toBe(403);
      }
    });

    it('should return "Email 格式錯誤"', async () => {
      const request: CreateUserDto = {
        name: 'york',
        email: 'asdf',
        password: '1234567890',
        confirmPassword: '1234567890',
        phoneNumber: '0912345678',
        locale: 'zh-TW',
      };
      try {
        await usersController.create(request);
      } catch (err) {
        expect(err.response.error_message).toBe('Email 格式錯誤');
        expect(err.status).toBe(403);
      }
    });

    it('should return "電話格式錯誤"', async () => {
      const request: CreateUserDto = {
        name: 'york',
        email: 'asdf@gmail.com',
        password: '1234567890',
        confirmPassword: '1234567890',
        phoneNumber: '0912345678',
        locale: 'zh-TW',
      };
      try {
        await usersController.create(request);
      } catch (err) {
        expect(err.response.error_message).toBe('電話格式錯誤');
        expect(err.status).toBe(403);
      }
    });

    it('should return "密碼少於8個字元"', async () => {
      const request: CreateUserDto = {
        name: 'york',
        email: 'asdf@gmail.com',
        password: '1234567',
        confirmPassword: '1234567',
        phoneNumber: '(866)0912345678',
        locale: 'zh-TW',
      };
      try {
        await usersController.create(request);
      } catch (err) {
        expect(err.response.error_message).toBe('密碼少於8個字元');
        expect(err.status).toBe(403);
      }
    });

    it('should return "確認密碼不正確"', async () => {
      const request: CreateUserDto = {
        name: 'york',
        email: 'asdf@gmail.com',
        password: '123456780',
        confirmPassword: '123456790',
        phoneNumber: '(866)0912345678',
        locale: 'zh-TW',
      };
      try {
        await usersController.create(request);
      } catch (err) {
        expect(err.response.error_message).toBe('確認密碼不正確');
        expect(err.status).toBe(403);
      }
    });
  });

  it('should return "Email已被使用"', async () => {
    jest.spyOn(usersService, 'findOneByEmail').mockImplementation(() => {
      const user: User = {
        name: 'york',
        id: 1,
        email: 'asdf@gmail.com',
        password: '123456789',
        phoneNumber: '(866)0912345678',
      };
      return Promise.resolve(user);
    });

    const request: CreateUserDto = {
      name: 'york',
      email: 'asdf@gmail.com',
      password: '123456789',
      confirmPassword: '123456789',
      phoneNumber: '(866)0912345678',
      locale: 'zh-TW',
    };
    try {
      await usersController.create(request);
    } catch (err) {
      expect(err.response.error_message).toBe('Email已被使用');
      expect(err.status).toBe(403);
    }
  });

  it('should return "手機已被使用"', async () => {
    jest.spyOn(usersService, 'findOneByEmail').mockImplementation(() => {
      return Promise.resolve(null);
    });
    jest.spyOn(usersService, 'findOneByPhoneNumber').mockImplementation(() => {
      const user: User = {
        name: 'york',
        id: 1,
        email: 'fdsa@gmail.com',
        password: '123456789',
        phoneNumber: '(866)0912345678',
      };
      return Promise.resolve(user);
    });

    const request: CreateUserDto = {
      name: 'york',
      email: 'asdf@gmail.com',
      password: '123456789',
      confirmPassword: '123456789',
      phoneNumber: '(866)0912345678',
      locale: 'zh-TW',
    };
    try {
      await usersController.create(request);
    } catch (err) {
      expect(err.response.error_message).toBe('手機已被使用');
      expect(err.status).toBe(403);
    }
  });

  it('should return "JWT token"', async () => {
    jest
      .spyOn(usersService, 'findOneByEmail')
      .mockImplementation(() => Promise.resolve(null));
    jest
      .spyOn(usersService, 'findOneByPhoneNumber')
      .mockImplementation(() => Promise.resolve(null));
    jest.spyOn(usersService, 'create').mockImplementation(() => {
      const user: User = {
        name: 'york',
        id: 1,
        email: 'fdsa@gmail.com',
        password: '123456789',
        phoneNumber: '(866)0912345678',
      };
      return Promise.resolve(user);
    });
    jest
      .spyOn(emailService, 'sendEmail')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(phoneService, 'sendSMS')
      .mockImplementation(() => Promise.resolve());

    const request: CreateUserDto = {
      name: 'york',
      email: 'asdf@gmail.com',
      password: '123456789',
      confirmPassword: '123456789',
      phoneNumber: '(866)0912345678',
      locale: 'zh-TW',
    };
    const jwtToken = await usersController.create(request);
    expect(typeof jwtToken.token).toBe('string');
  });
});
