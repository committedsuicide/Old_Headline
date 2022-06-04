import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PhraseController } from './phrase/phrase.controller';
import { PhraseService } from './phrase/phrase.service';
import { PhraseModule } from './phrase/phrase.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './phrase/category.entity';
import { Connection } from 'typeorm';
import { UserController } from './user/user.controller';
import { PhraseEntity } from './phrase/phrase.entity';
import { UserEntity } from './user/user.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AppEntity } from './app.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'root',

      entities: [CategoryEntity, PhraseEntity, UserEntity, AppEntity],
      synchronize: true,
    }),
    PhraseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
