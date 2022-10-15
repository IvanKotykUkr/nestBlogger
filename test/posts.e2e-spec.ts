import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../src/exeption.filter';
import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ObjectId } from 'mongodb';
import request = require('supertest');

jest.setTimeout(60_0000);
describe('Posts', () => {
  let app: INestApplication;

  const blogger = {
    id: '',
    name: 'Olya',
    youtubeUrl: 'https://www.youtube.com/watch?v=ez7s3N_Ra9U',
    createdAt: '',
  };
  const firstPost = {
    id: '',
    title: 'ddfddfdfdfs',
    shortDescription: 'Post from add post by blogger',
    content: 'cвісавvxvx',
    createdAt: '',
  };
  const secondPost = {
    id: '',
    title: 'new',
    shortDescription: 'Post from add post  blogger',
    content: 'second post',
    createdAt: '',
  };
  const thirdPost = {
    id: '',
    title: 'fds',
    shortDescription: 'Post from add post  dsfsdfsdblogger',
    content: 'secondsfsd post',
    createdAt: '',
  };
  const bedPost = {
    id: '',
    title: '',
    shortDescription: '',
    content: '',
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
  it('Create Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: blogger.name,
        youtubeUrl: blogger.youtubeUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(blogger.name);
    expect(res.body.youtubeUrl).toBe(blogger.youtubeUrl);

    blogger.id = res.body.id;
    blogger.createdAt = res.body.createdAt;
  });
  it('Create Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + blogger.id.toString() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: bedPost.title,
        shortDescription: bedPost.shortDescription,
        content: bedPost.content,
      })
      .expect(400)
      .expect({
        errorsMessages: [
          {
            message: 'title must be longer than or equal to 1 characters',
            field: 'title',
          },
          {
            message:
              'shortDescription must be longer than or equal to 1 characters',
            field: 'shortDescription',
          },
          {
            message: 'content must be longer than or equal to 1 characters',
            field: 'content',
          },
        ],
      });
  });
  it('Create Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + blogger.id.toString() + '/posts')

      .send({
        title: bedPost.title,
        shortDescription: bedPost.shortDescription,
        content: bedPost.content,
      })
      .expect(401);
  });
  it('should be 404 not correct id', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + new ObjectId() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: secondPost.title,
        shortDescription: secondPost.shortDescription,
        content: secondPost.content,
      })
      .expect(404);
  });
  it('Create Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + blogger.id.toString() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: secondPost.title,
        shortDescription: secondPost.shortDescription,
        content: secondPost.content,
      })
      .expect(201);
    secondPost.id = res.body.id;
    secondPost.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(secondPost.id);
    expect(res.body.title).toBe(secondPost.title);
    expect(res.body.shortDescription).toBe(secondPost.shortDescription);
    expect(res.body.content).toBe(secondPost.content);
    expect(res.body.bloggerId).toBe(blogger.id);
    expect(res.body.bloggerName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(secondPost.createdAt);
  });
  it('Create Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + blogger.id.toString() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: firstPost.title,
        shortDescription: firstPost.shortDescription,
        content: firstPost.content,
      })
      .expect(201);
    firstPost.id = res.body.id;
    firstPost.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(firstPost.id);
    expect(res.body.title).toBe(firstPost.title);
    expect(res.body.shortDescription).toBe(firstPost.shortDescription);
    expect(res.body.content).toBe(firstPost.content);
    expect(res.body.bloggerId).toBe(blogger.id);
    expect(res.body.bloggerName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(firstPost.createdAt);
  });
  it('Get post by blogger', async () => {
    const res = await request(app.getHttpServer())
      .get('/bloggers/' + blogger.id.toString() + '/posts')

      .expect(200);
    expect({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [
        {
          id: secondPost.id,
          title: secondPost.title,
          shortDescription: secondPost.shortDescription,
          content: secondPost.content,
          bloggerId: blogger.id,
          bloggerName: blogger.name,
          addedAt: secondPost.createdAt,
        },
        {
          id: firstPost.id,
          title: firstPost.title,
          shortDescription: firstPost.shortDescription,
          content: firstPost.content,
          bloggerId: blogger.id,
          bloggerName: blogger.name,
          addedAt: firstPost.createdAt,
        },
      ],
    });
  });
  it('Get post by blogger', async () => {
    const res = await request(app.getHttpServer())
      .get('/bloggers/' + new ObjectId() + '/posts')

      .expect(404);
  });
  it('Get post by blogger', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts')

      .expect(200);
    expect({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 2,
      items: [
        {
          id: secondPost.id,
          title: secondPost.title,
          shortDescription: secondPost.shortDescription,
          content: secondPost.content,
          bloggerId: blogger.id,
          bloggerName: blogger.name,
          addedAt: secondPost.createdAt,
        },
        {
          id: firstPost.id,
          title: firstPost.title,
          shortDescription: firstPost.shortDescription,
          content: firstPost.content,
          bloggerId: blogger.id,
          bloggerName: blogger.name,
          addedAt: firstPost.createdAt,
        },
      ],
    });
  });

  it('Create Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: thirdPost.title,
        shortDescription: thirdPost.shortDescription,
        content: thirdPost.content,
        bloggerId: blogger.id,
      })
      .expect(201);
    thirdPost.id = res.body.id;
    thirdPost.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(thirdPost.id);
    expect(res.body.title).toBe(thirdPost.title);
    expect(res.body.shortDescription).toBe(thirdPost.shortDescription);
    expect(res.body.content).toBe(thirdPost.content);
    expect(res.body.bloggerId).toBe(blogger.id);
    expect(res.body.bloggerName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(thirdPost.createdAt);
  });
  it('Get post', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts/' + thirdPost.id.toString())
      .expect(200);
    expect(res.body.id).toBe(thirdPost.id);
    expect(res.body.title).toBe(thirdPost.title);
    expect(res.body.shortDescription).toBe(thirdPost.shortDescription);
    expect(res.body.content).toBe(thirdPost.content);
    expect(res.body.bloggerId).toBe(blogger.id);
    expect(res.body.bloggerName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(thirdPost.createdAt);
  });
  afterAll(async () => {
    await app.close();
  });
});
