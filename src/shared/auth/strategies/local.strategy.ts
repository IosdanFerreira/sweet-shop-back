import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from 'src/modules/user/user.service';
import { SignInDto } from 'src/modules/user/dto/signin.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  /**
   * Valida o email e a senha do usuário.
   * Esse método é chamado automaticamente pelo Passport durante a autenticação.
   */
  validate(signinDto: SignInDto) {
    return this.userService.signin(signinDto);
  }
}
