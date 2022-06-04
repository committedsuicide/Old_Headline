import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PhraseEntity } from './phrase.entity';

@Injectable()
export class PhraseService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(PhraseEntity)
    private phraseRepository: Repository<PhraseEntity>,
  ) {}

  async getCategories(): Promise<SelectQueryBuilder<CategoryEntity>> {
    return await this.categoryRepository.query(
      'SELECT category_entity.id, "categoryName", count(p)\n' +
        'FROM public.category_entity\n' +
        'LEFT JOIN public.phrase_entity as "p"\n' +
        'ON category_entity.id = "categoryId"\n' +
        'GROUP BY category_entity.id',
    );
  }

  async getCategoryPhrases(
    categoryId: string,
  ): Promise<SelectQueryBuilder<PhraseEntity>> {
    return await this.phraseRepository
      .createQueryBuilder('phrase')
      .select('*')
      .where(`phrase.categoryId = '${categoryId}'`)
      .groupBy('phrase.id')
      .execute();
  }

  async getPhraseSoundPath(phraseId: string): Promise<string> {
    const phrase = await this.phraseRepository.findOne({
      relations: ['category'],
      where: { id: phraseId },
    });
    if (phrase) {
      console.log(phrase.category.categoryName);
      const filePath =
        '/sounds/phrases/' +
        phrase.category.categoryName +
        '/' +
        phrase.soundId +
        '.mp3';
      return filePath;
    }
    return 'error';
  }

  async addCategory(categoryName: string): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.categoryName = categoryName;
    return await this.categoryRepository.save(category);
  }

  async addPhrases(
    //Добавление заранее заготовленных фраз
    phrases: PhraseEntity[],
    categoryName: string,
  ): Promise<any> {
    const category = await this.categoryRepository.findOne({
      categoryName: categoryName,
    });
    if (category) {
      phrases.forEach((phrase) => {
        this.addPhrase(phrase, category);
      });
    } else {
      const newCategory = new CategoryEntity();
      newCategory.categoryName = categoryName;
      await this.categoryRepository.save(newCategory);
      phrases.forEach((phrase) => {
        this.addPhrase(phrase, newCategory);
      });
    }
    return;
  }

  private async addPhrase(phrase: PhraseEntity, category: CategoryEntity) {
    const existPhrase = await this.phraseRepository.find({
      relations: ['category'],
      where: { phrase: phrase.phrase },
    });
    let notExist = true;
    existPhrase.forEach((phr) => {
      if (phr.category.categoryName == category.categoryName) notExist = false;
    });
    if (notExist) {
      const newPhrase = new PhraseEntity();
      newPhrase.phrase = phrase.phrase;
      newPhrase.translation = phrase.translation;
      newPhrase.transcription = phrase.transcription;
      newPhrase.soundId = phrase.soundId;
      newPhrase.category = category;
      await this.phraseRepository.save(newPhrase);
    }
  }
  private transliterate(text) {
    text = text
      .replace(/\u0401/g, 'YO')
      .replace(/\u0419/g, 'I')
      .replace(/\u0426/g, 'TS')
      .replace(/\u0423/g, 'U')
      .replace(/\u041A/g, 'K')
      .replace(/\u0415/g, 'E')
      .replace(/\u041D/g, 'N')
      .replace(/\u0413/g, 'G')
      .replace(/\u0428/g, 'SH')
      .replace(/\u0429/g, 'SCH')
      .replace(/\u0417/g, 'Z')
      .replace(/\u0425/g, 'H')
      .replace(/\u042A/g, '')
      .replace(/\u0451/g, 'yo')
      .replace(/\u0439/g, 'i')
      .replace(/\u0446/g, 'ts')
      .replace(/\u0443/g, 'u')
      .replace(/\u043A/g, 'k')
      .replace(/\u0435/g, 'e')
      .replace(/\u043D/g, 'n')
      .replace(/\u0433/g, 'g')
      .replace(/\u0448/g, 'sh')
      .replace(/\u0449/g, 'sch')
      .replace(/\u0437/g, 'z')
      .replace(/\u0445/g, 'h')
      .replace(/\u044A/g, "'")
      .replace(/\u0424/g, 'F')
      .replace(/\u042B/g, 'I')
      .replace(/\u0412/g, 'V')
      .replace(/\u0410/g, 'a')
      .replace(/\u041F/g, 'P')
      .replace(/\u0420/g, 'R')
      .replace(/\u041E/g, 'O')
      .replace(/\u041B/g, 'L')
      .replace(/\u0414/g, 'D')
      .replace(/\u0416/g, 'ZH')
      .replace(/\u042D/g, 'E')
      .replace(/\u0444/g, 'f')
      .replace(/\u044B/g, 'i')
      .replace(/\u0432/g, 'v')
      .replace(/\u0430/g, 'a')
      .replace(/\u043F/g, 'p')
      .replace(/\u0440/g, 'r')
      .replace(/\u043E/g, 'o')
      .replace(/\u043B/g, 'l')
      .replace(/\u0434/g, 'd')
      .replace(/\u0436/g, 'zh')
      .replace(/\u044D/g, 'e')
      .replace(/\u042F/g, 'Ya')
      .replace(/\u0427/g, 'CH')
      .replace(/\u0421/g, 'S')
      .replace(/\u041C/g, 'M')
      .replace(/\u0418/g, 'I')
      .replace(/\u0422/g, 'T')
      .replace(/\u042C/g, "'")
      .replace(/\u0411/g, 'B')
      .replace(/\u042E/g, 'YU')
      .replace(/\u044F/g, 'ya')
      .replace(/\u0447/g, 'ch')
      .replace(/\u0441/g, 's')
      .replace(/\u043C/g, 'm')
      .replace(/\u0438/g, 'i')
      .replace(/\u0442/g, 't')
      .replace(/\u044C/g, "'")
      .replace(/\u0431/g, 'b')
      .replace(/\u044E/g, 'yu');

    return text;
  }
}
