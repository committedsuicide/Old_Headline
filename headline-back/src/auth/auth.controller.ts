import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  auth(@Body() body) {
    return this.authService.authUser(body?.queryParams);
  }
}
