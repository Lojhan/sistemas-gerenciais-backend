import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as events from 'events';
import { Interest } from 'src/database/entities/interest.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    events.prototype.on('interest', (data) => this.sendInterestingMail(data));
    events.prototype.on('purchase', (data) => this.sendPurchaseMail(data));
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

  public sendPurchaseMail(payload: any): void {
    console.log(payload.client);

    this.mailerService
      .sendMail({
        to: payload.client.username,
        subject: `Você acabou de comprar  ${payload.relation[0].psRelation.product.name} ✔`,
        // template: 'aprovacao',
        // context: {
        //   username: data[0].username,
        // },
        text: 'Brigado pela compra',
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
  }
}
