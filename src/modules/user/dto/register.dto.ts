import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  public readonly email!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public readonly password!: string;
}
