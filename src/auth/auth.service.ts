import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}
}
