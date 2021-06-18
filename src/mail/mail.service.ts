import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as events from 'events';
import { Interest } from 'src/database/entities/interest.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    events.prototype.on('sale', (data) => this.sendSaleMail(data));
    events.prototype.on('purchase', (data) => this.sendPurchaseMail(data));
  }

  public sendSaleMail(payload: any): void {
    this.mailerService
      .sendMail({
        to: payload.client.username,
        subject: `Quase seu!`,
        text: `Assim que confirmarmos o pagamento, o seu pedido será enviado até você ✔`,
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
  }

  public sendPurchaseMail(payload: any): void {
    this.mailerService
      .sendMail({
        to: payload.client.username,
        subject: `Pagamento confirmado!`,
        text: `O pagamento do produto foi confirmado e ele já está indo até você ✔`,
      })
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        throw new InternalServerErrorException(e);
      });
  }
}
