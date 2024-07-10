import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    super(User, dataSource.createEntityManager());
  }

  generateToken(userName) {
    const payload: JwtPayLoad = { userName };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ token: { accessToken: string }; data: User }> {
    const { userName, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ userName, password: hashedPassword });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username has taken!');
      } else {
        throw new InternalServerErrorException();
      }
    }
    user.password = null;
    const token = await this.generateToken(user.userName);

    const res = {
      token: token,
      data: user,
    };
    return res;
  }
}
