import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './user.repository';
import { JwtPayLoad } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      secretOrKey: 'A7E6F8E3756F7B15E5593E8532183',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayLoad): Promise<User> {
    const { userName } = payload;

    const user: User = await this.usersRepository.findOne({
      where: {
        userName,
      },
    });

    if (!user) {
      throw new UnauthorizedException('You should be logging again!');
    }

    return user;
  }
}
