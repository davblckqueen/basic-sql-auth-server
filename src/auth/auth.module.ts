import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

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
  ]
})
export class AuthModule {}
