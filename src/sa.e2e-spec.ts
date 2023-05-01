import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exeption.filter';
import request = require('supertest');

jest.setTimeout(60_0000);
describe('Users', () => {
  let app: INestApplication;
  const firstUser = {
    id: '',
    login: 'Vasa',
    email: 'beefier_tangos0q@icloud.com',
    password: 'Qwerty1234',
    createdAt: '',
  };
  const secondUser = {
    id: '',
    login: 'Masha',
    email: 'beefier_taos0q@icloud.com',
    password: 'Qw1234qw',
    createdAt: '',
  };
  const bedUser = {
    id: '',
    login: 'w',
    email: 'beefisd',
    password: '12345',
    createdAt: '',
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

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
  it('Create User', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/users')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        login: firstUser.login,
        password: firstUser.password,
        email: firstUser.email,
      })
      .expect(201);
    console.log(res.body.createdAt);
    firstUser.id = res.body.id;
    firstUser.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(firstUser.id);
    expect(res.body.login).toBe(firstUser.login);
    expect(res.body.email).toBe(firstUser.email);
    expect(res.body.createdAt).toBe(firstUser.createdAt);
  });
  it('Create User', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/users')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        login: secondUser.login,
        password: secondUser.password,
        email: secondUser.email,
      })
      .expect(201);

    secondUser.id = res.body.id;
    secondUser.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(secondUser.id);
    expect(res.body.login).toBe(secondUser.login);
    expect(res.body.email).toBe(secondUser.email);
    expect(res.body.createdAt).toBe(secondUser.createdAt);
  });
  it('Create User', async () => {
    const res = await request(app.getHttpServer())
      .post('/sa/users')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        login: bedUser.login,
        password: bedUser.password,
        email: bedUser.email,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'login must be longer than or equal to 3 characters',
            field: 'login',
          },
          { message: 'email must be an email', field: 'email' },
          {
            message: 'password must be longer than or equal to 6 characters',
            field: 'password',
          },
        ],
      });
  });
  it('Get Users', async () => {
    const res = await request(app.getHttpServer())
      .get('/sa/users')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .query({ sortDirection: 'asc' })
      .expect(200);
  });

  it('Delete User', async () => {
    const res = await request(app.getHttpServer())
      .delete('/sa/users/' + firstUser.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(204);
  });
  it('Ban User', async () => {
    const res = await request(app.getHttpServer())
      .put('/sa/users/' + secondUser.id.toString() + '/ban')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        isBanned: true,
        banReason: 'dfdxfsF?g.,frsdgfsfdgds',
      })
      .expect(204);
  }); /*
    it('Delete User', async () => {
      const res = await request(app.getHttpServer())
        .delete('/users/' + new ObjectId())
        .expect(401);
    });
    it('Delete User', async () => {
      const res = await request(app.getHttpServer())
        .delete('/users/' + new ObjectId())
        .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
        .expect(404);
    });
    it('Get Users', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect({
          pagesCount: 1,
          page: 1,
          pageSize: 10,
          totalCount: 1,
          items: [
            {
              id: secondUser.id,
              login: secondUser.login,
              email: secondUser.email,
              createdAt: secondUser.createdAt,
            },
          ],
        });
    });
  
     */
  afterAll(async () => {
    await app.close();
  });
});
