import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
