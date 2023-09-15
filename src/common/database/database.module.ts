
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.GLPI_DB_HOST,
            port: +process.env.GLPI_DB_PORT,
            database: process.env.GLPI_DB_NAME,
            username: process.env.GLPI_DB_USERNAME,
            password: process.env.GLPI_DB_PASSWORD,
            autoLoadEntities: true,
            synchronize: false,
            connectTimeout: +process.env.GLPI_DB_CONNECTION_TIMEOUT,
        }),
    ],
    controllers: [],
    providers: [],
})
export class DatabaseModule {}
