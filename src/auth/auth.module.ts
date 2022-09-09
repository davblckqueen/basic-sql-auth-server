import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

import { UsersModule } from '../users/users.module';

import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
        useFactory: () => ({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: 3600 },
        }),
    }),
  ],
  controllers: [AuthController],
  providers: [
      AuthService,
      UsersService,
      LocalStrategy,
  ],
  exports: [
      AuthService,
      TypeOrmModule,
      JwtModule,
  ]
})
export class AuthModule {}
