import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as events from 'events';
import { Interest } from 'src/database/entities/interest.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    events.prototype.on('interest', (data) => this.sendInterestingMail(data));
  }

  public sendInterestingMail(interest: Interest): void {
    console.log(interest);

    this.mailerService
      .sendMail({
        to: interest.user.username,
        subject: `Vamos te forçar a comprar esse ${interest.product.name} ✔`,
        // template: 'aprovacao',
        // context: {
        //   username: data[0].username,
        // },
        text: 'Compra essa merda obg',
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
  }
}
