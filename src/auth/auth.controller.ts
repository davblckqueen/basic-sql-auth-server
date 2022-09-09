import { Controller, Post, Body, HttpCode, Request } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDTO } from './dtos/user.dto';

@ApiTags('auth')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(204)
    async register(@Body() data: RegisterUserDTO) {
        return await this.authService.register(data)
            .then(() => 'The user has signed up successfully')
            .catch((error) => error);
    }

    @Post('login')
    @HttpCode(400)
    @UseGuards(LocalAuthGuard)
    async login(@Request() req): Promise<{access_token: string}> {
        return await this.authService.login(req.user)
            .catch((error) => error);
    }
}
