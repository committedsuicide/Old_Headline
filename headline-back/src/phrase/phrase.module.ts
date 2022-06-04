import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { PhraseController } from './phrase.controller';
import { PhraseService } from './phrase.service';
import {PhraseEntity} from "./phrase.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, PhraseEntity])],
  controllers: [PhraseController],
  providers: [PhraseService],
  //exports: [TypeOrmModule],
})
export class PhraseModule {}
