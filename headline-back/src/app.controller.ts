import {Body, Controller, Get, Param, Post, Res, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import {Roles} from "./roles/roles.decorator";
import {AuthGuard} from "@nestjs/passport";
import {RolesGuard} from "./roles/roles.guard";
import { getManager } from "typeorm";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('getPic:str')
  sendFile(@Param() params, @Res() response){
    return response.sendFile(params.str, {root: 'src/files'} )
  }
  @Post('exec-sql')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  executeSql(@Body() body) {
    const manager = getManager();
    return manager.query(body.sql);
  }
}
