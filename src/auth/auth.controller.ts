import { 
    Controller, 
    Post,
    Body, 
    HttpCode,
    Request,
    UseGuards
} from '@nestjs/common';
import {
    ApiOkResponse,
    ApiBody,
    ApiTags,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { User } from './entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { RegisterUserDTO, LoginDTO, TokenDTO } from './dtos/user.dto';

@ApiTags('auth')
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

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDTO})
    @ApiOkResponse({ type: TokenDTO })
    async login(@Request() req): Promise<{access_token: string}> {
        return await this.authService.login(req.user)
            .catch((error) => error);
    }
}
