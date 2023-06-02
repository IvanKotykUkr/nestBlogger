import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from './exeption.filter';
import { AppModule } from './app.module';
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
    isBanned: false,
  };
  const secondUser = {
    id: '',
    login: 'Masha',
    email: 'beefier_taos0q@icloud.com',
    password: 'Qw1234qw',
    createdAt: '',
    isBanned: false,
  };
  const bedUser = {
    id: '',
    login: 'w',
    email: 'beefisd',
    password: '12345',
    createdAt: '',
    isBanned: false,
  };
  let accessesTokenFirstUser = {};
  const firstPost = {
    id: '',
    title: 'ddfddfdfdfs',
    shortDescription: 'Post from add post by blogger',
    content: 'cвісавvxvx',
    createdAt: '',
    blogId: 'string',
    blogName: 'string',
    extendedLikesInfo: {},
  };
  const bloggerForTest1 = {
    id: '',
    name: 'Nadya',
    websiteUrl: 'https://www.youtube.com/watch?v=ez9s2N_Ra9U',
    description: 'sdadas',
    createdAt: '',
  };
  const firstComment = {
    content: 'fldgmdfmggdthgfhfghfhgfhod',
    id: '',
    createdAt: '',
    commentatorInfo: {
      userId: 'string',
      userLogin: 'string',
    },
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: '',
    },
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
  /* it('Ban User', async () => {
     const res = await request(app.getHttpServer())
       .put('/sa/users/' + firstUser.id.toString() + '/ban')
       .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
       .send({
         isBanned: false,
         banReason: 'dskjiojijoljoijij',
       })
       .expect(204);
 
     firstUser.isBanned = false;
   });
   
   */
  it('Login banned user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    accessesTokenFirstUser = res.body.accessToken;
  });
  it('Add Blog', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogger/blogs')
      .set('Authorization', `Bearer ${accessesTokenFirstUser}`)
      .send({
        name: bloggerForTest1.name,
        description: bloggerForTest1.description,
        websiteUrl: bloggerForTest1.websiteUrl,
      })
      .expect(201);
    bloggerForTest1.id = res.body.id;
    bloggerForTest1.createdAt = res.body.createdAt;
    expect(res.body.isMembership).toBe(false);
  });
  it('Add Post', async () => {
    const res = await request(app.getHttpServer())
      .post('/blogger/blogs/' + bloggerForTest1.id.toString() + '/posts')
      .set('Authorization', `Bearer ${accessesTokenFirstUser}`)
      .send({
        title: firstPost.title,
        shortDescription: firstPost.shortDescription,
        content: firstPost.content,
      })
      .expect(201);
    firstPost.id = res.body.id;
    firstPost.createdAt = res.body.createdAt;
    firstPost.blogId = res.body.blogId;
    firstPost.blogName = res.body.blogName;
    console.log(firstPost);
  });
  it('Add Comment', async () => {
    const res = await request(app.getHttpServer())
      .post('/posts/' + firstPost.id.toString() + '/comments')
      .set('Authorization', `Bearer ${accessesTokenFirstUser}`)
      .send({
        content: firstComment.content,
      })
      .expect(201);
    firstComment.id = res.body.id;
    firstComment.commentatorInfo = res.body.commentatorInfo;
    firstComment.createdAt = res.body.createdAt;
    firstComment.likesInfo = res.body.likesInfo;
    console.log(firstComment);
  });
  it('Get Comment', async () => {
    const res = await request(app.getHttpServer())
      .get('/comments/' + firstComment.id.toString())
      .expect(200)
      .expect({
        id: firstComment.id,
        content: firstComment.content,
        commentatorInfo: firstComment.commentatorInfo,
        createdAt: firstComment.createdAt,
        likesInfo: firstComment.likesInfo,
      });
  });
  it('Ban User', async () => {
    const res = await request(app.getHttpServer())
      .put('/sa/users/' + firstUser.id.toString() + '/ban')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        isBanned: true,
        banReason: 'dsf,;ldmsk;lfmsdkmfdslkmfkdnsfs',
      })
      .expect(204);

    firstUser.isBanned = true;
  });
  it('Get Comment', async () => {
    const res = await request(app.getHttpServer())
      .get('/comments/' + firstComment.id.toString())
      .expect(404);
    console.log(res.body);
  });
  it('unBan User', async () => {
    const res = await request(app.getHttpServer())
      .put('/sa/users/' + firstUser.id.toString() + '/ban')
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .send({
        isBanned: false,
        banReason: 'dsf,;ldmsk;lfmsdkmfdslkmfkdnsfs',
      })
      .expect(204);

    firstUser.isBanned = false;
  });
  it('Get Comment', async () => {
    const res = await request(app.getHttpServer())
      .get('/comments/' + firstComment.id.toString())
      .expect(200)
      .expect({
        id: firstComment.id,
        content: firstComment.content,
        commentatorInfo: firstComment.commentatorInfo,
        createdAt: firstComment.createdAt,
        likesInfo: firstComment.likesInfo,
      });
  });
  /*it('Get Users', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: firstUser.id,
            login: firstUser.login,
            email: firstUser.email,
            createdAt: firstUser.createdAt,
          },
          {
            id: secondUser.id,
            login: secondUser.login,
            email: secondUser.email,
            createdAt: secondUser.createdAt,
          },
        ],
      });
  });
  it('Delete User', async () => {
    const res = await request(app.getHttpServer())
      .delete('/users/' + firstUser.id.toString())
      .set({ Authorization: 'Basic YWRtaW46cXdlcnR5' })
      .expect(204);
  });
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
