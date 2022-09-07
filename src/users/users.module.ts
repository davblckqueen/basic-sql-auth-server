import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
