import { ApiProperty, OmitType, IntersectionType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { CreateProfileDTO } from '../../users/dtos/profile.dto';

export class RegisterUserDTO extends IntersectionType(
    OmitType(User, [
        'id',
        'createdAt', 
        'updatedAt',
    ] as const), 
    CreateProfileDTO,
) {}
