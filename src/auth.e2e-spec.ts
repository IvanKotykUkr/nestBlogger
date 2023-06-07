import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from './exeption.filter';
import { AppModule } from './app.module';
import { EmailAdapter } from './auth/application/adapters/email.adaptor';
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
  it('Registration User Already Exist', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: firstUser.login,
        password: firstUser.password,
        email: 'someemail@gmail.com',
      })
      .expect(400);
  });
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: firstUser.confirmCode,
      })
      .expect(204);
  });
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: firstUser.confirmCode,
      })
      .expect(400)
      .expect({
        errorsMessages: [{ message: 'code already confirmed', field: 'code' }],
      });
  });
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: '69fe1e82-a6ad-4b66-956b-f75b9c012424',
      })
      .expect(400)
      .expect({
        errorsMessages: [{ message: ' code doesnt exist', field: 'code' }],
      });
  });
  it('Registration User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration')
      .send({
        login: secondUser.login,
        password: secondUser.password,
        email: secondUser.email,
      })
      .expect(204);
  });
  it('Resending Confirmation', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({
        email: secondUser.email,
      })
      .expect(204);
    secondUser.confirmCode = process.env.ConfirmationCode;
  });
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: secondUser.confirmCode,
      })
      .expect(204);
  });
  it('Resending Confirmation Already Exist', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({
        email: secondUser.email,
      })
      .expect(400)
      .expect({
        errorsMessages: [{ message: 'code already confirmed', field: 'code' }],
      });
  });

  it('Resending Confirmation mail doesnt exist', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-email-resending')
      .send({
        email: 'sdfasdf@afdssf.com',
      })
      .expect(400)
      .expect({
        errorsMessages: [
          { message: 'user email doesnt exist', field: 'email' },
        ],
      });
  });
  it('Login User', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForFirstUser.accessToken = res.body.accessToken;
    tokensForFirstUser.refreshToken = cookies.toString();
  });
  it('Login Wrong Password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: firstUser.login,
        password: 'firstUser.password',
      })
      .expect(401);
    expect(res.body).toStrictEqual({
      message: [
        {
          field: 'password',
          message: 'WRONG PASSWORD',
        },
      ],
    });
  });
  it('Login incorrect values', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: firstUser.login,
        password:
          ';lkojihgfcdxcfgyhuiougytfguhfdghgdfnfggdfhfjgkhghfdjkgdhjmfhgfgjiouygtuhihygyu',
      })
      .expect(400);
    expect(res.body).toStrictEqual({
      errorsMessages: [
        {
          field: 'password',
          message: 'password must be shorter than or equal to 20 characters',
        },
      ],
    });
  });
  it('Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', 'refreshToken=' + tokensForFirstUser.refreshToken)
      .send({})
      .expect(401);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForFirstUser.accessToken = res.body.accessToken;
    tokensForFirstUser.refreshToken = cookies.toString();
  });
  it('Refresh Wrong Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Cookie', 'refreshToken=' + wrongRefresh)
      .send({})
      .expect(401);
    expect(res.body).toEqual({
      message: [
        {
          field: 'refreshToken',
          message: 'expired',
        },
      ],
    });
  });
  it('Me', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/me')

      .set('Authorization', `Bearer ${tokensForFirstUser.accessToken}`)

      .send({})
      .expect(401);

    expect(res.body.email).toBe(firstUser.email);
    expect(res.body.login).toBe(firstUser.login);
  });
  it('Logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', 'refreshToken=' + tokensForFirstUser.accessToken)
      .send({})
      .expect(401);
    expect(res.body).toStrictEqual({
      message: [
        {
          field: 'refreshToken',
          message: 'expired',
        },
      ],
    });
  });
  it('Logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', 'refreshToken=' + tokensForFirstUser.refreshToken)
      .send({})
      .expect(204);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);
  });

  afterAll(async () => {
    await app.close();
  });
});
