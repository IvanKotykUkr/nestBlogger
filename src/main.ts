import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exeption.filter';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.set('trust proxy', true);
  console.log('Connected successfully to mongoose server');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  await app.listen(PORT);

  console.log(`server started at http://localhost:${PORT}`);
}

bootstrap();
