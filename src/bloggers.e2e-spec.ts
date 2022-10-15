import request = require('supertest');
import { Test } from '@nestjs/testing';

import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exeption.filter';
import cookieParser from 'cookie-parser';

jest.setTimeout(60_0000);
describe('Bloggers', () => {
  let app: INestApplication;
  const bloggerForTest1 = {
    id: '',
    name: 'Nadya',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez9s2N_Ra9U',
    createdAt: '',
  };
  const bloggerForTest2 = {
    id: '',
    name: 'Olya',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez7s3N_Ra9U',
    createdAt: '',
  };
  const bedBloggerForTest = {
    id: '',
    name: 'Ncdfgdhfhtdghgdfhfhgdfhfdhdadyadhfjdytdfkmfjhgjh',
    youtubeUrl: '11',
    createdAt: '',
  };

  const bloggerForTestPagination = {
    id: '',
    name: 'Masha',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra1U',
    createdAt: '',
  };
  const bloggerForTestPagination1 = {
    id: '',
    name: 'Dasha',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra2U',
    createdAt: '',
  };
  const bloggerForTestPagination2 = {
    id: '',
    name: 'Pasha',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra3U',
    createdAt: '',
  };
  const bloggerForTestPagination3 = {
    id: '',
    name: 'Ivan',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra4U',
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

  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination.name,
        youtubeUrl: bloggerForTestPagination.youtubeUrl,
      })
      .expect(201);

    bloggerForTestPagination.id = res.body.id;
    bloggerForTestPagination.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination1.name,
        youtubeUrl: bloggerForTestPagination1.youtubeUrl,
      })
      .expect(201);
    bloggerForTestPagination1.id = res.body.id;
    bloggerForTestPagination1.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination2.name,
        youtubeUrl: bloggerForTestPagination2.youtubeUrl,
      })
      .expect(201);
    bloggerForTestPagination2.id = res.body.id;
    bloggerForTestPagination2.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination3.name,
        youtubeUrl: bloggerForTestPagination3.youtubeUrl,
      })
      .expect(201);
    bloggerForTestPagination3.id = res.body.id;
    bloggerForTestPagination3.createdAt = res.body.createdAt;
  });
  it(`/Get Blogger with Pagination`, () => {
    return request(app.getHttpServer())
      .get('/bloggers')
      .expect(200)
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 4,
        items: [
          {
            id: bloggerForTestPagination.id,
            name: bloggerForTestPagination.name,
            youtubeUrl: bloggerForTestPagination.youtubeUrl,
            createdAt: bloggerForTestPagination.createdAt,
          },
          {
            id: bloggerForTestPagination1.id,
            name: bloggerForTestPagination1.name,
            youtubeUrl: bloggerForTestPagination1.youtubeUrl,
            createdAt: bloggerForTestPagination1.createdAt,
          },
          {
            id: bloggerForTestPagination2.id,
            name: bloggerForTestPagination2.name,
            youtubeUrl: bloggerForTestPagination2.youtubeUrl,
            createdAt: bloggerForTestPagination2.createdAt,
          },
          {
            id: bloggerForTestPagination3.id,
            name: bloggerForTestPagination3.name,
            youtubeUrl: bloggerForTestPagination3.youtubeUrl,
            createdAt: bloggerForTestPagination3.createdAt,
          },
        ],
      });
  });
  it(`/Get Blogger with Pagination`, () => {
    return request(app.getHttpServer())
      .get('/bloggers')
      .query({ PageSize: '2' })
      .query({ PageNumber: '2' })

      .expect(200)
      .expect({
        pagesCount: 2,
        page: 2,
        pageSize: 2,
        totalCount: 4,
        items: [
          {
            id: bloggerForTestPagination2.id,
            name: bloggerForTestPagination2.name,
            youtubeUrl: bloggerForTestPagination2.youtubeUrl,
            createdAt: bloggerForTestPagination2.createdAt,
          },
          {
            id: bloggerForTestPagination3.id,
            name: bloggerForTestPagination3.name,
            youtubeUrl: bloggerForTestPagination3.youtubeUrl,
            createdAt: bloggerForTestPagination3.createdAt,
          },
        ],
      });
  });

  it('Create Blogger ', async () => {
    await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bedBloggerForTest.name,
        youtubeUrl: bedBloggerForTest.youtubeUrl,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'name must be shorter than or equal to 15 characters',
            field: 'name',
          },
          {
            message: 'youtubeUrl must be an URL address',
            field: 'youtubeUrl',
          },
        ],
      });
  });

  it('Create Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest1.name,
        youtubeUrl: bloggerForTest1.youtubeUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(bloggerForTest1.name);
    expect(res.body.youtubeUrl).toBe(bloggerForTest1.youtubeUrl);

    bloggerForTest1.id = res.body.id;
    bloggerForTest1.createdAt = res.body.createdAt;
  });

  it('Update Blogger', async () => {
    await request(app.getHttpServer())
      .put('/bloggers/' + bloggerForTest1.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest2.name,
        youtubeUrl: bloggerForTest2.youtubeUrl,
      })
      .expect(204);
  });
  it('Update Blogger', async () => {
    await request(app.getHttpServer())
      .put('/bloggers/' + bloggerForTest1.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bedBloggerForTest.name,
        youtubeUrl: bedBloggerForTest.youtubeUrl,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'name must be shorter than or equal to 15 characters',
            field: 'name',
          },
          {
            message: 'youtubeUrl must be an URL address',
            field: 'youtubeUrl',
          },
        ],
      });
  });
  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/bloggers/' + bloggerForTest1.id.toString())
      .expect(200)
      .expect({
        id: bloggerForTest1.id,
        name: bloggerForTest2.name,
        youtubeUrl: bloggerForTest2.youtubeUrl,
        createdAt: bloggerForTest1.createdAt,
      });
  });
  it('Create Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest2.name,
        youtubeUrl: bloggerForTest2.youtubeUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(bloggerForTest2.name);
    expect(res.body.youtubeUrl).toBe(bloggerForTest2.youtubeUrl);

    bloggerForTest2.id = res.body.id;
    bloggerForTest2.createdAt = res.body.createdAt;
  });
  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/bloggers/' + bloggerForTest2.id.toString())
      .expect(200)
      .expect({
        id: bloggerForTest2.id,
        name: bloggerForTest2.name,
        youtubeUrl: bloggerForTest2.youtubeUrl,
        createdAt: bloggerForTest2.createdAt,
      });
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/bloggers/' + bloggerForTest2.id.toString())
      .expect(401);
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/bloggers/' + bloggerForTest2.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(204);
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/bloggers/' + bloggerForTest2.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(404);
  });

  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/bloggers/' + bloggerForTest2.id.toString())
      .expect(404);
  });
  it('Delete all', async () => {
    await request(app.getHttpServer()).delete('/testing/all-data');
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete('/testing/all-data');
    await app.close();
  });
});
