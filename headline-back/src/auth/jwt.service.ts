import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  generateAccessToken(payload: any): string {
    return sign({ payload }, 'process.env.JWT_SECRET_KEY', { expiresIn: parseInt('86000', 10) });
  }
}
