import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogService } from '../log/log.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private logService: LogService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto);
    await this.logService.createLog(result.user.id, 'USER_REGISTERED');
    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto);
    await this.logService.createLog(result.user.id, 'USER_LOGIN');
    return result;
  }
}
