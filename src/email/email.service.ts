import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { HttpService } from '@nestjs/common';

@Injectable()
export class EmailService {
  private sendgridToken: string;
  private fromEmail: string;

  constructor(configService: ConfigService, private httpService: HttpService) {
    this.sendgridToken = configService.get('SENDGRID_TOKEN');
    this.fromEmail = configService.get('FROM_EMAIL');
  }

  sendEmail(subject: string, message: string, to: string): Promise<any> {
    return this.httpService
      .post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          personalizations: [{ to: [{ email: to }] }],
          from: { email: this.fromEmail },
          subject: subject,
          content: [{ type: 'text/plain', value: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.sendgridToken}`,
          },
        },
      )
      .toPromise();
  }
}
