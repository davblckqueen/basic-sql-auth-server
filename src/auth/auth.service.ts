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
                //Create & Save the entity
                const user: User = await this.createUser(data);
                resolve(user);
            } catch (error) {
                reject(new InternalServerErrorException(error));
            }
        });
    }

    private async createUser(data: RegisterUserDTO): Promise<User> {
        // encrypt password
        const encryptedPassword:string = await this.encryptPassword(data.password);   
        const rawResults = await this.repo.query(`INSERT INTO 'user' (email, password) 
                                     VALUES (${data.email}, ${encryptedPassword});
                                     SELECT LAST_INSERT_ID();`);
        const user = await this.repo.query(`SELECT * FROM 'user' WHERE 'id'=${rawResults}`);
        console.log(user);
        return user as User;
    }
    
    private async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

}
