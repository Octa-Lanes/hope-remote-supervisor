import { NestFactory } from '@nestjs/core';
import { registerDevice } from 'src/commons/helpers/register.helper';

import { AppModule } from './app.module';

async function bootstrap() {
  let registered = false;
  do {
    registered = await registerDevice();
  } while (!registered);
  {
    registered = await registerDevice();
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3300);
}
bootstrap();
