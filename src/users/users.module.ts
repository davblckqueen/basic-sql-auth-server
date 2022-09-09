import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtStrategy } from '../shared/strategies/jwt.strategy';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

import { AuthModule } from '../auth/auth.module';

import { Profile } from './entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [
      UsersService,
      AuthService,
      JwtStrategy
  ],
  exports: [
      UsersService,
      TypeOrmModule,
  ]
})
export class UsersModule {}
