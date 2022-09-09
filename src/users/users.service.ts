import {
    Inject,
    Injectable,
    forwardRef,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {isNil, omit as _omit} from 'lodash'

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
    
    async createProfile(data: CreateProfileDTO): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                // Validate user existence
                const userInfo = await this.authService.getUserInfo(data.userId);
                if(isNil(userInfo)) 
                    return reject(new NotFoundException(data.userId));
                // Create & Save the entity
                const profile: Profile = await this.createEntity(data);
                // END
                resolve(
                    _omit(
                        profile, 
                        ['user', 'createdAt', 'updatedAt'],
                    ) as Profile
                );
            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }
    
    async getProfile(user: any): Promise<Profile> {
        return new Promise(async (resolve, reject) => {
            try {
                const profile = await this.selectProfile(user.userId, true);
                if(isNil(profile)) 
                    return reject(new NotFoundException(user.userId));
                resolve(profile);
            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }

    private async createEntity(data: CreateProfileDTO): Promise<Profile> {
        try {
            // Run raw queries
            const {insertId} = await this.repo.query(`INSERT INTO profile (userId, name, address) 
                                     VALUES ('${data.userId}', '${data.name}', '${data.address}');`);
            // END
            return await this.selectProfile(insertId);
        } catch(err) {
            console.log('SQL ERROR: ', err);
            return {} as Profile;
        }
    }
    
    private async selectProfile(id: number, userId: boolean = false): Promise<Profile> {
        try {
            const profile = await this.repo.query(
                `SELECT ${!userId?'id,':''} name, address${
                    !userId
                    ? ', createdAt, updatedAt'
                    : ''
                } FROM profile WHERE ${ 
                    userId
                        ?'userId'
                        :'id' 
                }='${id}'`
            );
            return profile[0] as Profile ?? null;
        } catch(err) {
            console.log('ERROR: ', err);
            return null;
        }

    }
}
