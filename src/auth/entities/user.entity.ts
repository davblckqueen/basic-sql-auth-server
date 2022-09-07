// TypeORM  Decorators
import { Column, Entity, OneToOne, BeforeUpdate } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {isNil} from 'lodash'
// Extra entities
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity()
export class User extends BaseEntity {
    @Column()
    @ApiProperty()
    email: string;

    @Column()
    hash?: string;

    @ApiProperty()
    password?: string;

    @BeforeUpdate()
    private async encryptPassword(): void {
        const isMatch = !isNil(this.hash) 
            ? await bcrypt.compare(this.password, this.hash) 
            : false;
        if (isMatch) return;
        const salt = await bcrypt.genSalt();
        this.hash = await bcrypt.hash(this.password, salt);
    }
}
