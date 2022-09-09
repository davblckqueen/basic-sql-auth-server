
import { ApiProperty, OmitType, IntersectionType } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { Profile } from '../entities/profile.entity';

export class CreateProfileDTO extends OmitType(Profile, [
    'id',
    'user',
    'createdAt', 
    'updatedAt',
] as const) {
    userId: number;
}

export class UserInfoDTO extends IntersectionType(
    OmitType(User, [
        'id',
        'password',
        'createdAt', 
        'updatedAt',
    ] as const), 
    CreateProfileDTO,
) {
    @ApiProperty()
    userId: number;
}
