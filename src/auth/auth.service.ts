import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { LoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: { accessToken: string }; data: User }> {
    return this.usersRepository.signUp(authCredentialsDto);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { userName, password } = loginDto;
    const user = await this.usersRepository.findOne({
      where: {
        userName,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User name or password invalid, Please try again!',
      );
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return await this.usersRepository.generateToken(userName);
    } else {
      throw new UnauthorizedException(
        'User name or password invalid, Please try again!',
      );
    }
  }
}
