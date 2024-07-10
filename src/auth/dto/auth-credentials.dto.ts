import { IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from '../match.decorator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Match('password', { message: 'Password not match password confirm' })
  passwordConfirm: string;
}
