import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UsersService } from './users.service'
import { UserInfoDTO } from './dtos/profile.dto'

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOkResponse({ type: UserInfoDTO})
    async getProfile(@Request() req) {
        const profile = await this.usersService.getProfile(req.user)
            .catch((err) => err);
        return {...req.user, ...profile};
    }
}
