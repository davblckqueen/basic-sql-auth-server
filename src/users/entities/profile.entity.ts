// TypeORM  Decorators
import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// Extra entities
import { BaseEntity } from '../../shared/entities/base.entity';
import { User }from '../../auth/entities/user.entity';

@Entity()
export class Profile extends BaseEntity {
    @Column()
    @ApiProperty()
    name: string;

    @Column({ nullable: true })
    @ApiProperty({ required: false })
    address: string;

    @OneToOne(type => User, (user) => user.profile, {eager: true})
    @JoinColumn({ name: "userId" })
    user: User;
}
