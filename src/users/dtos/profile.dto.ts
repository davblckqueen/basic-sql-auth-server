
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Profile } from '../entities/profile.entity';

export class CreateProfileDTO extends OmitType(Profile, [
    'id',
    'createdAt', 
    'updatedAt',
] as const) {}
