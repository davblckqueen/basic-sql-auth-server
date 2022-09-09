import { 
    Inject,
    Injectable,
    forwardRef,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { isNil } from 'lodash'

import { UsersService } from '../users/users.service';

import { User } from './entities/user.entity';

import { RegisterUserDTO } from './dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private jwtService: JwtService
    ) {}
    
    async register(data: RegisterUserDTO): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // TODO: Validate data
                // Create & Save the entity
                const user: User = await this.createUser(data);
                // Create user's 
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
    
    async login(user: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const payload = { username: user.email, sub: user.id };
                resolve({
                    access_token: this.jwtService.sign( payload ),
                });
            } catch(error) {
                reject(new InternalServerErrorException(error));
            }

        });
    }

    async validateUser(email: string, passwordEntered: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // Check user existence
                const user = await this.selectUser(email);
                if (isNil(user)) 
                    return reject(new NotFoundException(email));
                // Check the password
                const passMatched = await this.checkPassword(
                    passwordEntered,
                    user.password,
                );
                if (!passMatched) resolve(null);
                // Omit hashed password on the resolve
                const { password, ...result } = user;
                // END
                resolve(result);
            } catch(error) {
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

    // PRIVATE FUNCTIONS --------------------------------------------------->

    private async createUser(data: RegisterUserDTO): Promise<User> {
        try {
            // encrypt password
            const encryptedPassword:string = await this.encryptPassword(data.password);   
            // Run raw queries
            const {insertId} = await this.repo.query(`INSERT INTO user (email, password) 
                                     VALUES ('${data.email}', '${encryptedPassword}');`);
            // END
            return await this.selectUser(+insertId);
        } catch(err) {
            console.log('SQL ERROR: ', err);
            return {} as User;
        }
    }

    private async selectUser(queryParam: number | string): Promise<User> {
        try {
            const user = await this.repo.query(
                `SELECT id, email, ${
                    typeof queryParam === 'string' 
                        ? 'password, '
                        : ''
                }createdAt, updatedAt FROM user WHERE ${
                    typeof queryParam === 'string' 
                        ? 'email' 
                        : 'id'
                }='${queryParam}' LIMIT 1`
            );
            return user[0] as User ?? null;
        } catch(err) {
            console.log('ERROR: ', err);
            return null;
        }
    }
    
    private async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    private async checkPassword(
        password: string, 
        hash: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}
