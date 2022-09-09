import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UsersService } from './users.service'

@Controller('profile')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getProfile(@Request() req) {
        const profile = await this.usersService.getProfile(req.user)
            .catch((err) => err);
        return {...req.user, ...profile};
    }
}
