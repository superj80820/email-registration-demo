import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ResponseUserDto,
  ResponseTokenDto,
} from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { EmailService } from '../email/email.service';
import { PhoneService } from '../phone/phone.service';
import { ConfigService } from '../config/config.service';
import { I18NService } from '../i18n/i18n.service';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
    private readonly i18nService: I18NService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseTokenDto> {
    const validator = {
      isEmail(email: string): boolean {
        return email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null;
      },
      isPhoneNumber(phoneNumber: string): boolean {
        return (
          phoneNumber.match(
            /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{5})[-. ]*(\d{5})(?: *x(\d+))?\s*$/,
          ) !== null
        );
      },
      isContentLessthanSpecNumber(
        content: string,
        specNumber: number,
      ): boolean {
        return content.length <= specNumber;
      },
      isPassordEqulConfirmPassword(
        password: string,
        confirmPassword: string,
      ): boolean {
        return password === confirmPassword;
      },
    };

    if (createUserDto.locale === undefined) createUserDto.locale = 'zh-TW';

    if (
      (createUserDto.email === undefined &&
        createUserDto.phoneNumber === undefined) ||
      createUserDto.name === undefined
    ) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorArgs',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!validator.isEmail(createUserDto.email)) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorEmailFormat',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!validator.isPhoneNumber(createUserDto.phoneNumber)) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorPhoneNumberFormat',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (validator.isContentLessthanSpecNumber(createUserDto.password, 8)) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorLessthanSpec8Number',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      !validator.isPassordEqulConfirmPassword(
        createUserDto.password,
        createUserDto.confirmPassword,
      )
    ) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorPassordEqulConfirmPassword',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (!!(await this.usersService.findOneByEmail(createUserDto.email))) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorEmailExist',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      !!(await this.usersService.findOneByPhoneNumber(
        createUserDto.phoneNumber,
      ))
    ) {
      throw new HttpException(
        {
          error_message: this.i18nService.getMessage(
            'errorPhoneNumberExist',
            createUserDto.locale,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersService.create(createUserDto);
    await this.emailService.sendEmail(
      'AmazingTalker',
      `${createUserDto.name} ${this.i18nService.getMessage(
        'welcome',
        createUserDto.locale,
      )}`,
      createUserDto.email,
    );
    await this.phoneService.sendSMS(
      'AmazingTalker',
      `${createUserDto.name} ${this.i18nService.getMessage(
        'welcome',
        createUserDto.locale,
      )}`,
      createUserDto.phoneNumber,
    );

    return new ResponseTokenDto(
      jwt.sign({ userID: user.id }, this.configService.get('HASH_SECRET')),
    );
  }

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    const users = (await this.usersService.findAll()).map(
      (item: User) => new ResponseUserDto(item),
    );
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    const user = await this.usersService.findOne(id);
    return new ResponseUserDto(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
