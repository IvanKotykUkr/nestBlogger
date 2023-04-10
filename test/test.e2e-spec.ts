import { EmailAdapter } from '../src/auth/application/adapters/email.adaptor';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/exeption.filter';

describe('dsasd', () => {
  it('new', () => {
    expect(2).toBe(2);
  });
});
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
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    await app.init();
  });
  it('Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', 'refreshToken=' + wrongRefresh)
      .send({})
      .expect(401);
    console.log(res.body);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForFirstUser.accessToken = res.body.accessToken;
    tokensForFirstUser.refreshToken = cookies.toString();
  });
});
