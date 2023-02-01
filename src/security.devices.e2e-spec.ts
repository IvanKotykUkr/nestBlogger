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
import * as process from 'process';
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
  const tokensForIphone = {
    accessToken: '',
    refreshToken: '',
  };
  const tokensForMac = {
    accessToken: '',
    refreshToken: '',
  };
  const tokensForiPad = {
    accessToken: '',
    refreshToken: '',
  };
  const tokensForMicrosoft = {
    accessToken: '',
    refreshToken: '',
  };
  const newToken = {
    accessToken: '',
    refreshToken: '',
  };
  const deviceAndData2 = {
    date: '',
    device: '',
  };
  const deviceAndData3 = {
    date: '',
    device: '',
  };
  const deviceAndDataiPad = {
    date: '',
    device: '',
  };
  const deviceAndDataMicrosoft = {
    date: '',
    device: '',
  };
  const deviceAndData = {
    date: '',
    device: '',
  };
  const iPhoneUserAgent =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
  const macUserAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15 UserAgent';
  const iPadUserAgent =
    'Mozilla/5.0 (iPad; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
  const microsoftUserAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.53 Safari/537.36 Edg/103.0.1264.37';
  const wrongRefresh =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2E0ZGFjZDljZWNkMGQyYjhjY2VlOGYiLCJpYXQiOjE2NzE3NDgzMzM3NjIsImRldmljZUlkIjoiY2U1ODJkYmQtYWEzMC00MGU0LThjZjQtNmFkZjllM2JlZTczIiwiZXhwIjoxNjcxNzQ4MzM3MzYyfQ.labPE2TIBIpdJPsN74dtF0yhPESiVi44Gq64lzLN48o';
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
  it('Confirmation User', async () => {
    await request(app.getHttpServer())
      .post('/auth/registration-confirmation')
      .send({
        code: firstUser.confirmCode,
      })
      .expect(204);
  });
  it('Login User in Mac', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', macUserAgent)
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForMac.accessToken = res.body.accessToken;
    tokensForMac.refreshToken = cookies.toString();
    deviceAndData2.device = process.env.DEVICEID;
    deviceAndData2.date = process.env.DATEDEVICE;
  });
  it('Login User i n iPhone', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', iPhoneUserAgent)
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForIphone.accessToken = res.body.accessToken;
    tokensForIphone.refreshToken = cookies.toString();
    deviceAndData3.device = process.env.DEVICEID;
    deviceAndData3.date = process.env.DATEDEVICE;
  });
  it('Get All Devices', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + tokensForMac.refreshToken)
      .set('User-Agent', macUserAgent)
      .expect(200)
      .expect([
        {
          ip: '::ffff:127.0.0.1',
          title: macUserAgent,
          lastActiveDate: deviceAndData2.date,
          deviceId: deviceAndData2.device,
        },
        {
          ip: '::ffff:127.0.0.1',
          title: iPhoneUserAgent,
          lastActiveDate: deviceAndData3.date,
          deviceId: deviceAndData3.device,
        },
      ]);
  });
  it('Get All Devices 401', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + 'tokensForMac.refreshToken')
      .set('User-Agent', macUserAgent)
      .expect(401);
  });
  it('Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('User-Agent', macUserAgent)
      .set('Cookie', 'refreshToken=' + tokensForMac.refreshToken)
      .send({})
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    newToken.accessToken = res.body.accessToken;
    newToken.refreshToken = cookies.toString();
  });
  it('Refresh Token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('User-Agent', macUserAgent)
      .set('Cookie', 'refreshToken=' + tokensForMac.refreshToken)
      .send({})
      .expect(401);
  });
  it('Get All Devices', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + tokensForIphone.refreshToken)
      .set('User-Agent', iPhoneUserAgent)
      .expect(200);
  });
  it('Terminate all other', async () => {
    const res = await request(app.getHttpServer())
      .delete('/security/devices')
      .set('Cookie', 'refreshToken=' + newToken.refreshToken)
      .set('User-Agent', macUserAgent)
      .expect(204);
  });

  it('Get All Devices', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + newToken.refreshToken)
      .expect(200)
      .expect([
        {
          ip: '::ffff:127.0.0.1',
          title: macUserAgent,
          lastActiveDate: deviceAndData2.date,
          deviceId: deviceAndData2.device,
        },
      ]);
  });
  it('Login User in iPad', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', iPadUserAgent)
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForiPad.accessToken = res.body.accessToken;
    tokensForiPad.refreshToken = cookies.toString();
    deviceAndDataiPad.device = process.env.DEVICEID;
    deviceAndDataiPad.date = process.env.DATEDEVICE;
  });
  it('Login User in Microsoft', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .set('User-Agent', microsoftUserAgent)
      .send({
        login: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers['set-cookie'][0]
      .split(',')
      .map((item) => item.split(';')[0])
      .map((item) => item.split('=')[1]);

    tokensForMicrosoft.accessToken = res.body.accessToken;
    tokensForMicrosoft.refreshToken = cookies.toString();
    deviceAndDataMicrosoft.device = process.env.DEVICEID;
    deviceAndDataMicrosoft.date = process.env.DATEDEVICE;
  });
  it('Get All Devices', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + tokensForMac.refreshToken)
      .expect(200)
      .expect([
        {
          ip: '::ffff:127.0.0.1',
          title: macUserAgent,
          lastActiveDate: deviceAndData2.date,
          deviceId: deviceAndData2.device,
        },

        {
          ip: '::ffff:127.0.0.1',
          title: iPadUserAgent,
          lastActiveDate: deviceAndDataiPad.date,
          deviceId: deviceAndDataiPad.device,
        },
        {
          ip: '::ffff:127.0.0.1',
          title: microsoftUserAgent,
          lastActiveDate: deviceAndDataMicrosoft.date,
          deviceId: deviceAndDataMicrosoft.device,
        },
      ]);
  });
  it('Delete one', async () => {
    const res = await request(app.getHttpServer())
      .delete('/security/devices/' + deviceAndDataiPad.device)
      .set('Cookie', 'refreshToken=' + wrongRefresh)
      .expect(403);
  });
  it('Delete one', async () => {
    const res = await request(app.getHttpServer())
      .delete('/security/devices/' + deviceAndDataiPad.device)
      .set('Cookie', 'refreshToken=' + tokensForiPad.refreshToken)
      .expect(204);
  });
  it('Delete one', async () => {
    const res = await request(app.getHttpServer())
      .delete('/security/devices/' + deviceAndDataiPad.device)
      .set('Cookie', 'refreshToken=' + tokensForiPad.refreshToken)
      .expect(404);
  });
  it('Get All Devices', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', 'refreshToken=' + tokensForMac.refreshToken)
      .expect(200)
      .expect([
        {
          ip: '::ffff:127.0.0.1',
          title: macUserAgent,
          lastActiveDate: deviceAndData2.date,
          deviceId: deviceAndData2.device,
        },
        {
          ip: '::ffff:127.0.0.1',
          title: microsoftUserAgent,
          lastActiveDate: deviceAndDataMicrosoft.date,
          deviceId: deviceAndDataMicrosoft.device,
        },
      ]);
  });
  afterAll(async () => {
    await app.close();
  });
});
