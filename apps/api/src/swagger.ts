import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Fireart showcase application')
    .setDescription('This app is a showcase for the purposes of recruitment.')
    .setVersion('1.0.0')
    .build();

  const factory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, factory);
}
