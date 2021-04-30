import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.listen(3000);
})();
