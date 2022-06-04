import { Injectable, LiteralObject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { VerifyCallback } from 'passport-vkontakte';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'process.env.JWT_SECRET_KEY',
    });
  }

  validate(payload: LiteralObject, done: VerifyCallback): void {
    try {
      done(null, payload);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
