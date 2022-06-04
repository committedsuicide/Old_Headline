import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../phrase/category.entity';
import * as crypto from 'crypto';
import * as qs from 'querystring';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getUserCategories(vkId: string): Promise<any> {
    return await this.userRepository
      .createQueryBuilder('user')
      .relation('categories')
      .of(vkId)
      .loadMany();
  }
  async getUserInfo(vkId: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ vkId: vkId });
  }
  async givePro(vkId: Array<any>): Promise<any> {
    for (const id of vkId) {
      const user = await this.userRepository.findOne({ vkId: id });
      if (user) {
        user.tariff = 'Pro';
        const categories = await this.categoryRepository.find();
        user.categories = [...categories];
        await this.userRepository.save(user);
      }
    }
  }
  async SignUp(vkId: string): Promise<UserEntity>{
    const user = new UserEntity();
    user.vkId = vkId;
    const defaultCategories = await this.getDefaultCategories();
    user.categories = [...defaultCategories];
    return await this.userRepository.save(user);
  }
  async giveCategory(
    vkId: string,
    categoryName: string,
  ): Promise<CategoryEntity[]> {
    const user = await this.userRepository.findOne({
      relations: ['categories'],
      where: { vkId: vkId },
    });
    if (user) {
      const category = await this.categoryRepository.findOne({
        categoryName: categoryName,
      });
      if (category) {
        if (!user.categories.includes(category)) {
          user.categories.push(category);
        }
      }
    }
    await this.userRepository.save(user);
    return user.categories;
  }
  async findUserByVkId(vkId: string): Promise<UserEntity>{
    return await this.userRepository.findOne({ vkId: vkId });
  }
  private async getDefaultCategories(): Promise<CategoryEntity[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select('*')
      .where(
        "\"categoryName\" IN ('Дни недели, месяцы', 'Цвета и числа', 'Приветствия и извинения')",
      )
      .execute();
  }

}
