import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.CORS_ORIGIN_URL != undefined ? process.env.CORS_ORIGIN_URL : "*" });
  
  app.use(bodyParser.json());

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false,
    transform: true
  }));

  app.setGlobalPrefix('api/v1');

  app.use(helmet({
    frameguard: { action: 'deny' }, //establece que si alguien intenta incorporar tu sitio en un marco o iframe, el navegador debe negarlo, lo que ayuda a prevenir ataques de clickjacking.
    hidePoweredBy: true, //Esta configuración elimina o cambia el encabezado X-Powered-By en las respuestas HTTP
    xssFilter: true, //Esta configuración activa el filtro de scripting en sitios cruzados (XSS) proporcionado por los navegadores.
    referrerPolicy: { policy: 'same-origin' }, //Esta configuración controla qué información sobre el origen de la solicitud se incluye en la cabecera Referer de las solicitudes salientes. 
    //strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true } //HSTS es una política de seguridad que obliga a los navegadores a usar siempre HTTPS para comunicarse
  }))

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Documentación de API del Proyecto SIAGIE. API de GLPI.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);
  
  await app.listen(+process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap();
