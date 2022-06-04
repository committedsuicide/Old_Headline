import { UserEntity } from '../user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as qs from 'querystring';
import * as crypto from 'crypto';
import { JwtService } from './jwt.service';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async authUser(vkParams): Promise<any> {
    const params = this.checkParametersReceivedFromVK(vkParams);
    if (params.isValidParams) {
      let user = await this.userService.findUserByVkId(params.userId);
      if (!user) {
        user = await this.userService.SignUp(params.userId);
      }
      const jwt = this.jwtService.generateAccessToken(user);
      return { user: user, jwt: jwt };
    }
    return {error: 'wrong params'}
  }
  private checkParametersReceivedFromVK(params): any {
    const ordered: any = {};
    Object.keys(params)
      .sort()
      .forEach((key) => {
        if (key.slice(0, 3) === 'vk_') {
          ordered[key] = params[key];
        }
      });
    const stringParams = qs.stringify(ordered);
    const paramsHashHeadline = crypto
      .createHmac('sha256', '7IWrXeITrjRN5YXEUDfx')
      .update(stringParams)
      .digest()
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=$/, '');

    const isValidParams = paramsHashHeadline === params.sign;

    return { isValidParams, userId: ordered.vk_user_id };
  }
}
