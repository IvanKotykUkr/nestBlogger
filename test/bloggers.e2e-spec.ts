import request = require('supertest');
import { Test } from '@nestjs/testing';

import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/exeption.filter';
import cookieParser from 'cookie-parser';

jest.setTimeout(60_0000);
describe('Bloggers', () => {
  let app: INestApplication;
  const bloggerForTest1 = {
    id: '',
    name: 'Nadya',
    websiteUrl: 'https://www.youtube.com/watch?v=ez9s2N_Ra9U',
    description: 'sdadas',
    createdAt: '',
  };
  const bloggerForTest2 = {
    id: '',
    name: 'Olya',
    websiteUrl: 'https://www.youtube.com/watch?v=ez7s3N_Ra9U',
    description: 'sdadas',
    createdAt: '',
  };
  const bedBloggerForTest = {
    id: '',
    name: 'Ncdfgdhfhtdghgdfhfhgdfhfdhdadyadhfjdytdfkmfjhgjh',
    websiteUrl: '11',
    description: 'sdadas',
    createdAt: '',
  };

  const bloggerForTestPagination = {
    id: '',
    name: 'Masha',
    websiteUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra1U',
    description: 'sdasddas',
    createdAt: '',
  };
  const bloggerForTestPagination1 = {
    id: '',
    name: 'Dasha',
    websiteUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra2U',
    description: 'sdadsanas',
    createdAt: '',
  };
  const bloggerForTestPagination2 = {
    id: '',
    name: 'Pasha',
    websiteUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra3U',
    description: 'sdadak,ks',
    createdAt: '',
  };
  const bloggerForTestPagination3 = {
    id: '',
    name: 'Ivan',
    websiteUrl: 'https://www.youtube.com/watch?v=ez0s3N_Ra4U',
    description: 'sdadagyks',
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
      .post('/blogs/')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination.name,
        description: bloggerForTestPagination.description,
        websiteUrl: bloggerForTestPagination.websiteUrl,
      })
      .expect(201);

    bloggerForTestPagination.id = res.body.id;
    bloggerForTestPagination.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination1.name,
        description: bloggerForTestPagination1.description,
        websiteUrl: bloggerForTestPagination1.websiteUrl,
      })
      .expect(201);
    bloggerForTestPagination1.id = res.body.id;
    bloggerForTestPagination1.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination2.name,
        description: bloggerForTestPagination2.description,
        websiteUrl: bloggerForTestPagination2.websiteUrl,
      })
      .expect(201);
    bloggerForTestPagination2.id = res.body.id;
    bloggerForTestPagination2.createdAt = res.body.createdAt;
  });
  it('Create Blogger for pagination ', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTestPagination3.name,
        description: bloggerForTestPagination3.description,
        websiteUrl: bloggerForTestPagination3.websiteUrl,
      })
      .expect(201);
    bloggerForTestPagination3.id = res.body.id;
    bloggerForTestPagination3.createdAt = res.body.createdAt;
  });
  it(`/Get Blogger with Pagination`, () => {
    return request(app.getHttpServer())
      .get('/blogs')
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
            websiteUrl: bloggerForTestPagination.websiteUrl,
            description: bloggerForTestPagination.description,
            createdAt: bloggerForTestPagination.createdAt,
          },
          {
            id: bloggerForTestPagination1.id,
            name: bloggerForTestPagination1.name,
            websiteUrl: bloggerForTestPagination1.websiteUrl,
            description: bloggerForTestPagination1.description,
            createdAt: bloggerForTestPagination1.createdAt,
          },
          {
            id: bloggerForTestPagination2.id,
            name: bloggerForTestPagination2.name,
            websiteUrl: bloggerForTestPagination2.websiteUrl,
            description: bloggerForTestPagination2.description,
            createdAt: bloggerForTestPagination2.createdAt,
          },
          {
            id: bloggerForTestPagination3.id,
            name: bloggerForTestPagination3.name,
            websiteUrl: bloggerForTestPagination3.websiteUrl,
            description: bloggerForTestPagination3.description,
            createdAt: bloggerForTestPagination3.createdAt,
          },
        ],
      });
  });
  it(`/Get Blogger with Pagination`, () => {
    return request(app.getHttpServer())
      .get('/blogs')
      .query({ pageSize: '2' })
      .query({ pageNumber: '2' })

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
            websiteUrl: bloggerForTestPagination2.websiteUrl,
            description: bloggerForTestPagination2.description,
            createdAt: bloggerForTestPagination2.createdAt,
          },
          {
            id: bloggerForTestPagination3.id,
            name: bloggerForTestPagination3.name,
            websiteUrl: bloggerForTestPagination3.websiteUrl,
            description: bloggerForTestPagination3.description,
            createdAt: bloggerForTestPagination3.createdAt,
          },
        ],
      });
  });

  it('Create Blogger ', async () => {
    await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bedBloggerForTest.name,
        description: bedBloggerForTest.description,
        websiteUrl: bedBloggerForTest.websiteUrl,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'name must be shorter than or equal to 15 characters',
            field: 'name',
          },
          {
            message: 'websiteUrl must be an URL address',
            field: 'websiteUrl',
          },
        ],
      });
  });

  it('Create Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest1.name,
        description: bloggerForTest1.description,
        websiteUrl: bloggerForTest1.websiteUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(bloggerForTest1.name);
    expect(res.body.websiteUrl).toBe(bloggerForTest1.websiteUrl);

    bloggerForTest1.id = res.body.id;
    bloggerForTest1.createdAt = res.body.createdAt;
  });

  it('Update Blogger', async () => {
    await request(app.getHttpServer())
      .put('/blogs/' + bloggerForTest1.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest2.name,
        description: bloggerForTest2.description,
        websiteUrl: bloggerForTest2.websiteUrl,
      })
      .expect(204);
  });
  it('Update Blogger', async () => {
    await request(app.getHttpServer())
      .put('/blogs/' + bloggerForTest1.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bedBloggerForTest.name,
        description: bedBloggerForTest.description,
        websiteUrl: bedBloggerForTest.websiteUrl,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'name must be shorter than or equal to 15 characters',
            field: 'name',
          },
          {
            message: 'websiteUrl must be an URL address',
            field: 'websiteUrl',
          },
        ],
      });
  });
  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/blogs/' + bloggerForTest1.id.toString())
      .expect(200)
      .expect({
        id: bloggerForTest1.id,
        name: bloggerForTest2.name,
        websiteUrl: bloggerForTest2.websiteUrl,
        description: bloggerForTest2.description,
        createdAt: bloggerForTest1.createdAt,
      });
  });
  it('Create Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogs')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: bloggerForTest2.name,
        description: bloggerForTest2.description,
        websiteUrl: bloggerForTest2.websiteUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(bloggerForTest2.name);
    expect(res.body.websiteUrl).toBe(bloggerForTest2.websiteUrl);

    bloggerForTest2.id = res.body.id;
    bloggerForTest2.createdAt = res.body.createdAt;
  });
  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/blogs/' + bloggerForTest2.id.toString())
      .expect(200)
      .expect({
        id: bloggerForTest2.id,
        name: bloggerForTest2.name,
        websiteUrl: bloggerForTest2.websiteUrl,
        description: bloggerForTest2.description,
        createdAt: bloggerForTest2.createdAt,
      });
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/blogs/' + bloggerForTest2.id.toString())
      .expect(401);
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/blogs/' + bloggerForTest2.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(204);
  });
  it('Delete Blogger', async () => {
    await request(app.getHttpServer())
      .delete('/blogs/' + bloggerForTest2.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(404);
  });

  it(`/Get Blogger`, () => {
    return request(app.getHttpServer())
      .get('/blogs/' + bloggerForTest2.id.toString())
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
