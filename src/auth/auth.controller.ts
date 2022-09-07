import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
}
