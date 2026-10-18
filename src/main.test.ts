process.env.AUTH_REPO = "local";
process.env.NODE_ENV = "test";

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LocalStorageStore } from '@auth/infrastructure/persistence';

async function bootstrapTestServer() {
  if (process.argv.includes('--fresh')) {
    LocalStorageStore.getInstance().clear();
    console.log('🧹 [LocalStorageStore] Almacenamiento local limpiado (--fresh).');
  }

  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  app.setGlobalPrefix("/api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Koder Animalts API [TEST SERVER - LOCAL STORAGE]')
    .setDescription(
      'Servidor de pruebas para Koder Animalts. ' +
      'Inyecta repositorios de LocalStorage para Auth, Users, Owners, Veterinarians y Clinics sin requerir base de datos externa.'
    )
    .setVersion('1.0-test')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el Access Token JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`\n============================================================`);
  console.log(`🚀 [TEST SERVER] Servidor levantado en MODO LOCAL STORAGE`);
  console.log(`📡 URL Base API:  http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger Docs:  http://localhost:${port}/api-docs`);
  console.log(`💾 Repositorios:  LocalStorageAuthService (con persistencia local en .test-local-storage.json)`);
  console.log(`✨ Listo para pruebas de SignUp, selección de rol y Cypress`);
  console.log(`============================================================\n`);
}

bootstrapTestServer();
