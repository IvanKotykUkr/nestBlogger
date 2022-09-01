import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Connected successfully to mongoose server');
  app.enableCors();
  await app.listen(PORT);
  console.log(`server started at http://localhost:${PORT}`);
}

bootstrap();
