import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './exeption.filter';
import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ObjectId } from 'mongodb';
import request = require('supertest');

jest.setTimeout(60_0000);
describe('Posts', () => {
  let app: INestApplication;

  const blogger = {
    id: '',
    name: 'Olya',
    websiteUrl: 'https://www.youtube.com/watch?v=ez7s3N_Ra9U',
    createdAt: '',
  };
  const differentBlogger = {
    id: '',
    name: 'Vasya',
    websiteUrl: 'https://www.youtube.com/watch?v=ez7s3N_Ra4U',
    createdAt: '',
  };
  const firstPost = {
    id: '',
    title: 'ddfddfdfdfs',
    shortDescription: 'Post from add post by blogger',
    content: 'cвісавvxvx',
    createdAt: '',
  };
  const differentPost = {
    id: '',
    title: 'different',
    shortDescription: 'Post from add post by blogger',
    content: 'adwqsdadsafdsa',
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
        websiteUrl: blogger.websiteUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(blogger.name);
    expect(res.body.websiteUrl).toBe(blogger.websiteUrl);

    blogger.id = res.body.id;
    blogger.createdAt = res.body.createdAt;
  });
  it('Create Different Blogger ', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        name: differentBlogger.name,
        websiteUrl: differentBlogger.websiteUrl,
      })
      .expect(201);

    expect(res.body.name).toBe(differentBlogger.name);
    expect(res.body.websiteUrl).toBe(differentBlogger.websiteUrl);

    differentBlogger.id = res.body.id;
    differentBlogger.createdAt = res.body.createdAt;
  });
  it('Create Post', async () => {
    await request(app.getHttpServer())
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
    await request(app.getHttpServer())
      .post('/bloggers/' + blogger.id.toString() + '/posts')

      .send({
        title: bedPost.title,
        shortDescription: bedPost.shortDescription,
        content: bedPost.content,
      })
      .expect(401);
  });
  it('should be 404 not correct id', async () => {
    await request(app.getHttpServer())
      .post('/bloggers/' + new ObjectId() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: secondPost.title,
        shortDescription: secondPost.shortDescription,
        content: secondPost.content,
      })
      .expect(404);
  });
  it('Create Post for blogger', async () => {
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
    expect(res.body.blogId).toBe(blogger.id);
    expect(res.body.blogName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(secondPost.createdAt);
  });
  it('Create Post for blogger', async () => {
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
    expect(res.body.blogId).toBe(blogger.id);
    expect(res.body.blogName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(firstPost.createdAt);
  });
  it('Create Post for different blogger', async () => {
    const res = await request(app.getHttpServer())
      .post('/bloggers/' + differentBlogger.id.toString() + '/posts')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: differentPost.title,
        shortDescription: differentPost.shortDescription,
        content: differentPost.content,
      })
      .expect(201);
    differentPost.id = res.body.id;
    differentPost.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(differentPost.id);
    expect(res.body.title).toBe(differentPost.title);
    expect(res.body.shortDescription).toBe(differentPost.shortDescription);
    expect(res.body.content).toBe(differentPost.content);
    expect(res.body.blogId).toBe(differentBlogger.id);
    expect(res.body.blogName).toBe(differentBlogger.name);
    expect(res.body.createdAt).toBe(differentPost.createdAt);
  });
  it('Get post by blogger', async () => {
    await request(app.getHttpServer())
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
          blogId: blogger.id,
          blogName: blogger.name,
          addedAt: secondPost.createdAt,
        },
        {
          id: firstPost.id,
          title: firstPost.title,
          shortDescription: firstPost.shortDescription,
          content: firstPost.content,
          blogId: blogger.id,
          blogName: blogger.name,
          addedAt: firstPost.createdAt,
        },
      ],
    });
  });
  it('Get post by blogger', async () => {
    await request(app.getHttpServer())
      .get('/bloggers/' + new ObjectId() + '/posts')

      .expect(404);
  });
  it('Get all post', async () => {
    await request(app.getHttpServer())
      .get('/posts')

      .expect(200);
    expect({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 3,
      items: [
        {
          id: secondPost.id,
          title: secondPost.title,
          shortDescription: secondPost.shortDescription,
          content: secondPost.content,
          blogId: blogger.id,
          blogName: blogger.name,
          addedAt: secondPost.createdAt,
        },
        {
          id: firstPost.id,
          title: firstPost.title,
          shortDescription: firstPost.shortDescription,
          content: firstPost.content,
          blogId: blogger.id,
          blogName: blogger.name,
          addedAt: firstPost.createdAt,
        },
        {
          id: differentPost.id,
          title: differentPost.title,
          shortDescription: differentPost.shortDescription,
          content: differentPost.content,
          blogId: differentBlogger.id,
          blogName: differentBlogger.name,
          addedAt: differentPost.createdAt,
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
        blogId: blogger.id,
      })
      .expect(201);
    thirdPost.id = res.body.id;
    thirdPost.createdAt = res.body.createdAt;
    expect(res.body.id).toBe(thirdPost.id);
    expect(res.body.title).toBe(thirdPost.title);
    expect(res.body.shortDescription).toBe(thirdPost.shortDescription);
    expect(res.body.content).toBe(thirdPost.content);
    expect(res.body.blogId).toBe(blogger.id);
    expect(res.body.blogName).toBe(blogger.name);
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
    expect(res.body.blogId).toBe(blogger.id);
    expect(res.body.blogName).toBe(blogger.name);
    expect(res.body.createdAt).toBe(thirdPost.createdAt);
  });
  it('Update  Post', async () => {
    await request(app.getHttpServer())
      .put('/posts/' + thirdPost.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: firstPost.title,
        shortDescription: firstPost.shortDescription,
        content: firstPost.content,
        blogId: differentBlogger.id,
      })
      .expect(204);
  });
  it('Update  Post', async () => {
    await request(app.getHttpServer())
      .put('/posts/' + thirdPost.id.toString())
      .send({
        title: firstPost.title,
        shortDescription: firstPost.shortDescription,
        content: firstPost.content,
        blogId: differentBlogger.id,
      })
      .expect(401);
  });
  it('Update  Post', async () => {
    await request(app.getHttpServer())
      .put('/posts/' + thirdPost.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        title: bedPost.title,
        shortDescription: bedPost.shortDescription,
        content: bedPost.content,
        blogId: differentBlogger.id,
      })
      .expect(400);
  });
  it('Get post', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts/' + thirdPost.id.toString())
      .expect(200);
    expect(res.body.id).toBe(thirdPost.id);
    expect(res.body.title).toBe(firstPost.title);
    expect(res.body.shortDescription).toBe(firstPost.shortDescription);
    expect(res.body.content).toBe(firstPost.content);
    expect(res.body.blogId).toBe(differentBlogger.id);
    expect(res.body.blogName).toBe(differentBlogger.name);
    expect(res.body.createdAt).toBe(thirdPost.createdAt);
  });
  it('Delete  Post', async () => {
    await request(app.getHttpServer())
      .delete('/posts/' + firstPost.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(204);
  });
  it('Get post', async () => {
    const res = await request(app.getHttpServer())
      .get('/posts/' + firstPost.id.toString())
      .expect(404);
  });
  it('Delete  Post', async () => {
    await request(app.getHttpServer())
      .delete('/posts/' + firstPost.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(404);
  });
  afterAll(async () => {
    await app.close();
  });
});
