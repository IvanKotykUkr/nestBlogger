import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { EmailAdapter } from './auth/application/adapters/email.adaptor';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exeption.filter';
import request = require('supertest');

jest.setTimeout(60_0000);
describe('Users', () => {
  let emailAdapter: EmailAdapter;
  let app: INestApplication;
  const firstUser = {
    id: '',
    login: 'Vasa',
    email: 'beefier_tangos0q@icloud.com',
    password: 'Qwerty1234',
    createdAt: '',
    confirmCode: '',
  };
  const secondUser = {
    id: '',
    login: 'Masha',
    email: 'beefier_taos0q@icloud.com',
    password: 'Qw1234qw',
    createdAt: '',
    confirmCode: '',
  };
  const bedUser = {
    id: '',
    login: 'w',
    email: 'beefisd',
    password: '12345',
    createdAt: '',
  };
  const tokensForFirstUser = {
    accessToken: '',
    refreshToken: '',
  };
  const wrongRefresh =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzU5N2UxOTA5ODEwNmE2YzhjYWNmNTgiLCJpYXQiOjE2NjY4MDkzNjksImV4cCI6MTY2NjgxMjk2OX0.P2lZ2aSjvkvvTYsNzfRJuVpa-eiD5nrY6ZRdg_qq_BI';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    emailAdapter = moduleRef.get<EmailAdapter>(EmailAdapter);
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: errors => {
          const errorsForResponse = [];
          errors.forEach(e => {
            const constraintsKeys = Object.keys(e.constraints);
            constraintsKeys.forEach(ckey => {
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
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    await app.init();

    await request(app.getHttpServer()).delete('/testing/all-data');
  });
  it('Registration User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: firstUser.login,
        password: firstUser.password,
        email: firstUser.email,
      })
      .expect(204);
    firstUser.confirmCode = process.env.ConfirmationCode;
  });
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: firstUser.confirmCode,
      })
      .expect(204);
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map(item => item.split(';')[0])
      .map(item => item.split('=')[1]);

    tokensForFirstUser.accessToken = res.body.accessToken;
    tokensForFirstUser.refreshToken = cookies.toString();
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(429);
  });
  afterAll(async () => {
    await app.close();
  });
});
