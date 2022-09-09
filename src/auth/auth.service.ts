import { 
    Inject,
    Injectable,
    forwardRef,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { User } from './entities/user.entity';

import { RegisterUserDTO } from './dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) {}
    
    async register(data: RegisterUserDTO): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // TODO: Validate data
                // Create & Save the entity
                const user: User = await this.createUser(data);
                // Create user's profile
                await this.usersService.createProfile({
                    userId: user.id,
                    name: data.name,
                    address: data.address,
                });
                // END
                resolve(user);
            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }

    async getUserInfo(userId: number): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                const user: User = await this.selectUser(userId);
                resolve(user);
            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }

    private async createUser(data: RegisterUserDTO): Promise<User> {
        try {
            // encrypt password
            const encryptedPassword:string = await this.encryptPassword(data.password);   
            // Run raw queries
            const {insertId} = await this.repo.query(`INSERT INTO user (email, password) 
                                     VALUES ('${data.email}', '${encryptedPassword}');`);
            // END
            return await this.selectUser(insertId);
        } catch(err) {
            console.log('SQL ERROR: ', err);
            return {} as User;
        }
    }

    private async selectUser(id: number): Promise<User> {
        try {
            const user = await this.repo.query(`SELECT id, email, createdAt, updatedAt FROM user WHERE id='${id}' LIMIT 1`);
            return user[0] as User;
        } catch(err) {
            console.log('ERROR: ', err);
            return {} as User;
        }
    }
    
    private async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

}
