import { GlpiApiController } from './modules/glpi-api-rest/infrastructure/controller/glpiApi.controller';
import { GlpiApiRestModule } from './modules/glpi-api-rest/glpiApiRest.module';
import { GlpiModule } from './modules/glpi/glpi.module';
import { DatabaseModule } from './common/database/database.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ApiTokenCheckMiddleware } from './common/middleware/apiTokenCheck.middleware';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [
        GlpiApiRestModule, 
        GlpiModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_MAX_SECONDS,
      limit: +process.env.THROTTLER_MAX_CONSULTS
    }),
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
