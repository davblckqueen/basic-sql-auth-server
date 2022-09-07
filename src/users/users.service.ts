import {
    Inject,
    Injectable,
    forwardRef,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';

import { Profile } from './entities/profile.entity';

import { CreateProfileDTO } from './dtos/profile.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Profile) private readonly repo: Repository<Profile>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}
    
    async create(data: CreateProfileDTO): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {

            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }
}
