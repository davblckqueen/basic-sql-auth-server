import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
      }),
      TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: ['**/*.entity{.ts,.js}'],
          migrationsTableName: 'migration',
          migrations: ['config/migration/*.ts'],
          synchronize: true,
          retryAttempts: 2,
      }),
      UsersModule,
      AuthModule,
  ],
})
export class AppModule {}
