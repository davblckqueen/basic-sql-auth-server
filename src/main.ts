import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {createDatabase} from "typeorm-extension";

async function bootstrap() {
  await createDatabase({ifNotExist: true});  
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
