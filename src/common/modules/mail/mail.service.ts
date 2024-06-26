import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, code: string) {
    this.mailerService
      .sendMail({
        to: email,
        from: 'test@gmail.com',
        subject: 'Please verify your email <Asman>',
        html: `
          Your verification code
          <br />
          code: <b>${code}</b>
        `,
      })
      .then((result) => {
        console.log(result);
      });
    return true;
  }
}
