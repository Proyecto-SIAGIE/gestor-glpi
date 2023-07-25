import { GlpiApiController } from './modules/glpi-api-rest/infrastructure/controller/glpiApi.controller';
import { GlpiApiRestModule } from './modules/glpi-api-rest/glpiApiRest.module';
import { GlpiModule } from './modules/glpi/glpi.module';
import { DatabaseModule } from './common/database/database.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ApiTokenCheckMiddleware } from './common/middleware/apiTokenCheck.middleware';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
        GlpiApiRestModule, 
        GlpiModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiTokenCheckMiddleware)
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
