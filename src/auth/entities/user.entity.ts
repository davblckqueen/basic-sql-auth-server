// TypeORM  Decorators
import { Column, Entity, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
// Extra entities
import { BaseEntity } from '../../shared/entities/base.entity';
import { Profile }from '../../users/entities/profile.entity';

@Entity()
export class User extends BaseEntity {
    @Column()
    @ApiProperty()
    email: string;

    @Column()
    @ApiProperty()
    password?: string;

    @OneToOne(type => Profile, (profile) => profile.user)
    @ApiProperty({ type: Profile, required: false })
    profile?: Profile;

    /*
    @Column()
    hash?: string;
    @BeforeUpdate()
    private async encryptPassword(): void {
        const isMatch = !isNil(this.hash) 
            ? await bcrypt.compare(this.password, this.hash) 
            : false;
        if (isMatch) return;
        const salt = await bcrypt.genSalt();
        this.hash = await bcrypt.hash(this.password, salt);
    }
    */
}
