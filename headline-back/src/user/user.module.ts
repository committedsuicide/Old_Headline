import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {CategoryEntity} from "../phrase/category.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, CategoryEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
