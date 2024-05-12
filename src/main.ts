import { NestFactory } from '@nestjs/core';
import { initDevice } from 'src/commons/helpers/register.helper';

import { AppModule } from './app.module';

async function bootstrap() {
  await initDevice();
  const app = await NestFactory.create(AppModule);
  await app.listen(3300);
}
bootstrap();
