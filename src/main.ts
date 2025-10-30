import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Endpoints for Users, Products, and Auth')
    .setVersion('0.1.1')
    .addBearerAuth() // enables "Authorize" button in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
    extraModels: [], // ✅ no schemas here
  });

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // ✅ hides all schema models
    },
  });

  await app.listen(3000);
}
bootstrap();
