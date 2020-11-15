import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendSMS(subject: string, message: string, to: string): Promise<any> {
    // No need to implement
    return Promise.resolve();
  }
}
