import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneService {
  async sendSMS(subject: string, message: string, to: string): Promise<any> {
    // No need to implement
    return Promise.resolve();
  }
}
