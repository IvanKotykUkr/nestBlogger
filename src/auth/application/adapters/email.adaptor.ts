import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailAdapter {
  constructor(protected mailerService: MailerService) {}

  async sendEmail(email: string, subject: string, text: string) {
    //await this.mailerService.sendMail({ to: email, subject, html: text });
    return;
  }
}
