import {Body, Controller, Get, Param, Post, Res, UseGuards} from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { PhraseService } from './phrase.service';
import { PhraseEntity } from './phrase.entity';
import { SelectQueryBuilder } from 'typeorm';
import {Roles} from "../roles/roles.decorator";
import { AuthGuard } from "@nestjs/passport";
import {RolesGuard} from "../roles/roles.guard";

@Controller('phrase')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('categories')
  getCategories(): Promise<SelectQueryBuilder<CategoryEntity>> {
    return this.phraseService.getCategories();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('categoryPhrases:categoryId')
  getCategoryPhrases(
    @Param() params,
  ): Promise<SelectQueryBuilder<PhraseEntity>> {
    return this.phraseService.getCategoryPhrases(params.categoryId);
  }
  @Get('getPhraseSound:phraseId')
  async getPhraseSound(
      @Param() params, @Res() response
  ): Promise<any>{
    const filePath = await this.phraseService.getPhraseSoundPath(params.phraseId);
    return response.sendFile(filePath,{root: 'src/files'});
  }
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('addCategory')
  addCategory(@Body('categoryName') categoryName): Promise<CategoryEntity> {
    return this.phraseService.addCategory(categoryName);
  }

  //Заранее заготовленные фразы. Создает категории, если их нет
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('addPhrases')
  addPhrases(@Body() body): any {
    for (const category in body) {
      this.phraseService.addPhrases(body[category], category);
    }
    return;
  }
}
