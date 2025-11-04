// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const config = new DocumentBuilder()
//     .setTitle('API Documentation')
//     .setDescription('Endpoints for Users, Products, and Auth')
//     .setVersion('0.1.1')
//     .addBearerAuth() // enables "Authorize" button in Swagger UI
//     .build();

//   const document = SwaggerModule.createDocument(app, config, {
//     ignoreGlobalPrefix: false,
//     deepScanRoutes: true,
//     extraModels: [], // no schemas here
//   });

//   SwaggerModule.setup('api-docs', app, document, {
//     swaggerOptions: {
//       defaultModelsExpandDepth: -1, // hides all schema models
//     },
//   });

//   await app.listen(3000);
// }
// bootstrap();

// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as dotenv from 'dotenv';

// async function bootstrap() {
//   // Load .env variables before app creation
//   dotenv.config();

//   // Create app with CORS enabled
//   const app = await NestFactory.create(AppModule, { cors: true });

//   // Enable global CORS for all origins (adjust if needed)
//   app.enableCors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   });

//   // Use global validation pipes (prevents unwanted payloads)
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // remove unknown properties
//       transform: true, // auto-transform DTOs
//       forbidNonWhitelisted: false, // set to true for stricter checks
//     }),
//   );

//   // Optional: global API prefix (comment out if not needed)
//   // app.setGlobalPrefix('api');

//   // Swagger Configuration
//   const config = new DocumentBuilder()
//     .setTitle('API Documentation')
//     .setDescription('Endpoints for Users, Products, and Auth')
//     .setVersion('0.1.2')
//     .addBearerAuth() // enables “Authorize” button for JWT
//     .build();

//   const document = SwaggerModule.createDocument(app, config, {
//     deepScanRoutes: false,
//     ignoreGlobalPrefix: false,
//   });

//   // Enable Swagger only for non-production or manually enabled
//   if (
//     process.env.NODE_ENV !== 'production' ||
//     process.env.ENABLE_SWAGGER === 'true'
//   ) {
//     SwaggerModule.setup('api-docs', app, document, {
//       swaggerOptions: {
//         defaultModelsExpandDepth: -1, // hides schema models
//       },
//       useGlobalPrefix: true, // adjusts URL if global prefix is used
//     });

//     console.log(
//       `📘 Swagger running at http://localhost:${process.env.PORT || 3000}/api-docs`,
//     );
//   }

//   // Listen on 0.0.0.0 for Render/Railway compatibility
//   const PORT = process.env.PORT || 3000;
//   await app.listen(PORT, '0.0.0.0');

//   console.log(`Server running on http://localhost:${PORT}`);
// }
// bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // Load environment variables
  dotenv.config();

  // Create NestJS app
  const app = await NestFactory.create(AppModule, { cors: true });

  // Enable CORS globally
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // ✅ Always enable Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Endpoints for Users, Products, Merchants, and Auth')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // hides schema models for cleaner view
    },
  });

  console.log(`📘 Swagger is always available at /api-docs`);

  // Use Render-compatible port
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}

bootstrap();
