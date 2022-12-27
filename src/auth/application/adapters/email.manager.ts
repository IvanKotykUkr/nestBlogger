import { Injectable } from '@nestjs/common';
import 'reflect-metadata';
import { EmailAdapter } from './email.adaptor';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapter: EmailAdapter) {}

  async sendEmailConfirmationMessage(email: string, code: string) {
    const message = this.message(code, 'confirmation');

    await this.emailAdapter.sendEmail(email, 'registration', message);
    return;
  }

  async resentEmailConfirmationMessage(email: string, code: string) {
    const message = this.message(code, 'confirmation');

    await this.emailAdapter.sendEmail(
      email,
      'resent registration code',
      message,
    );
    return;
  }

  async sendPasswordRecoveryCode(email: string, recoveryCode: string) {
    const message = this.message(recoveryCode, 'recovery');

    await this.emailAdapter.sendEmail(email, 'recovery Password', message);
    return;
  }

  protected message(code: string, type: string) {
    process.env.ConfirmationCode = code;
    if (type.toString() === 'confirmation') {
      return ` <div><a href=https://some-front.com/confirm-registration?code=${code}>https://some-front.com/confirm-registration?code=${code}</a></div>`;
    }
    return ` <div><a href=https://some-front.com/recovery-password?recoveryCode=${code}>https://some-front.com/recovery-password?recoveryCode=${code}</a></div>`;
  }
}
