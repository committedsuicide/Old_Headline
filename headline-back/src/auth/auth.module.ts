import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'
import { JwtService } from './jwt.service'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
