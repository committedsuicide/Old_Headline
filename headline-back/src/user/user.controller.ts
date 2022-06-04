import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import {CategoryEntity} from "../phrase/category.entity";
import {AuthGuard} from "@nestjs/passport";
import {Roles} from "../roles/roles.decorator";
import {RolesGuard} from "../roles/roles.guard";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('userCategories:vkId')
  getUserCategories(@Param() params): Promise<UserEntity> {
    return this.userService.getUserCategories(params.vkId);
  }
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('givePro')
  givePro(@Body() body): Promise<any> {
    return this.userService.givePro(body.ids);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('giveCategory')
  giveCategory(@Body() body): Promise<CategoryEntity[]> {
    return this.userService.giveCategory(body.id, body.categoryName);
  }
}
