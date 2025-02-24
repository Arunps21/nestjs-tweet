import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeOrm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    ProfilesModule,
    TweetsModule,
    LikesModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        typeOrmConfig(configService),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
