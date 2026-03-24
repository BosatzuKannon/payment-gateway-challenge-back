import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const config = new DocumentBuilder()
    .setTitle('Payment Gateway Challenge API')
    .setDescription('API for processing product payments with integration')
    .setVersion('1.0')
    .addTag('transactions')
    .addTag('stock')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Ruta donde estará disponible la documentación
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting server', err);
});
