import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as amqp from 'amqplib/callback_api';
import * as events from 'events';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';

@Injectable()
export class MessagesService {
  private channel: amqp.Channel;
  constructor(
    @InjectRepository(ProductStockRelationRepository)
    private productStockRelationRepository: ProductStockRelationRepository,
  ) {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) throw error0;
      connection.createChannel((error1, channel) => {
        if (error1) throw error1;
        this.channel = channel;

        this.channel.consume('sales', (msg) => this.handleSaleMessage(msg));
        this.channel.consume('purchases', (msg) =>
          this.handlePurchaseMessage(msg),
        );
      });
    });
    // setInterval(
    //   () =>
    //     this.channel.get('hello', {}, (_err, data) => {
    //       console.log(data);
    //     }),
    //   50000,
    // );
  }

  handleSaleMessage(msg: amqp.Message) {
    this.channel.ack(msg);
    const purchase = msg.content.toJSON();
    console.log(purchase);

    events.prototype.emit('purchase', purchase);
  }

  handlePurchaseMessage(msg: amqp.Message) {
    this.channel.ack(msg);
    const purchase = JSON.parse(msg.content.toString());
    console.log(purchase);

    events.prototype.emit('purchase', purchase);
  }
}
