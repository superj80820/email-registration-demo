import { User } from '../user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  locale: string;
}

export class ResponseUserDto {
  id: number;
  email: string;
  phoneNumber: string;
  name: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
  }
}

export class ResponseTokenDto {
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
