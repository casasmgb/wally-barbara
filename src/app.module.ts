import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WebModule } from './web/web.module';

@Module({
  imports: [WebModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
