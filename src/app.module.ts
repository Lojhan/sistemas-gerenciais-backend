/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StorageModule } from './storage/storage.module';
import { LogsModule } from './logs/logs.module';
import { MarketLogsModule } from './market-logs/market-logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from './messages/messages.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(
      'mongodb+srv://root:1234@cluster0.szknf.mongodb.net/Cluster0?retryWrites=true"',
      {
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      },
    ),
    ProductsModule,
    StorageModule,
    LogsModule,
    MarketLogsModule,
    MessagesModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'emailsistemasgerenciais@gmail.com',
          pass: '12342134',
        },
      },
      defaults: {
        from: '"Sistemas Gerenciais" <emailsistemasgerenciais@gmail.com>',
      },

      preview: true,
      // template: {
      //   dir: join(__dirname, '..', 'templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
  ],
})
export class AppModule {}
