import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Basic SQL AUTH Server')
    .setDescription(
      'This application manage all related to USER AUTHENTICATION',
    )
    .setVersion('0.1.0')
    .addTag('auth')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000, () => {
    console.log(
      `Basic SQL AUTH Server is running on: http://localhost:3000`,
    );
    console.log(
      `PS: If you want to see the API documentation use this: http://localhost:3000/docs`,
    );
  });
}
bootstrap();
