import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../user/dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingEmail = await this.userService.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.userService.findByUsername(
      dto.username,
    );
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    const user = await this.userService.create(
      dto.email,
      dto.username,
      dto.password,
    );

    const accessToken = this.generateToken(user.id, user.email, user.username);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmailOrUsername(
      dto.emailOrUsername,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const accessToken = this.generateToken(user.id, user.email, user.username);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken,
    };
  }

  private generateToken(
    userId: number,
    email: string,
    username: string,
  ): string {
    const payload = { sub: userId, email, username };
    return this.jwtService.sign(payload);
  }
}
