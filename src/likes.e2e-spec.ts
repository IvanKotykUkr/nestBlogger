import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from "@nestjs/common";

import cookieParser from "cookie-parser";
import { EmailAdapter } from "./auth/application/adapters/email.adaptor";
import { Test } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./exeption.filter";
import request = require("supertest");

jest.setTimeout(60_0000);
describe("Users", () => {
  let emailAdapter: EmailAdapter;
  let app: INestApplication;
  const firstUser = {
    id: "",
    login: "Vasa",
    email: "beefier_tangos0q@icloud.com",
    password: "Qwerty1234",
    createdAt: "",
    confirmCode: "",
  };
  const secondUser = {
    id: "",
    login: "Masha",
    email: "differenrtemail@icloud.com",
    password: "Qwerty1234",
    createdAt: "",
    confirmCode: "",
  };

  const tokensForFirstUser = {
    accessToken: "",
    refreshToken: "",
  };
  const tokensForSecondUser = {
    accessToken: "",
    refreshToken: "",
  };
  const blogger = {
    id: "",
    name: "Olya",
    websiteUrl: "https://www.youtube.com/watch?v=ez7s3N_Ra9U",
    description: "dddfsd",
    createdAt: "",
  };

  const firstPost = {
    id: "",
    title: "ddfddfdfdfs",
    shortDescription: "Post from add post by blogger",
    content: "cвісавvxvx",
    createdAt: "",
  };
  const firstComment = {
    userId: "",
    content: "fldgmdfmggdthgfhfghfhgfhod",
    id: "",
    userLogin: "",
    createdAt: "",
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: "",
    },
  };
  const secondComment = {
    userId: "",
    content: "This is a second comment for that post",
    id: "",
    userLogin: "",
    createdAt: "",
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: "",
    },
  };
  const content = "Difent conntent for comment";
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
      })
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.use(cookieParser());
    await app.init();

    await request(app.getHttpServer()).delete("/testing/all-data");
  });
  it("Registration User", async () => {
    await request(app.getHttpServer())
      .post("/auth/registration")
      .send({
        login: firstUser.login,
        password: firstUser.password,
        email: firstUser.email,
      })
      .expect(204);
    firstUser.confirmCode = process.env.ConfirmationCode;
  });
  it("Registration User", async () => {
    await request(app.getHttpServer())
      .post("/auth/registration")
      .send({
        login: secondUser.login,
        password: secondUser.password,
        email: secondUser.email,
      })
      .expect(204);
    secondUser.confirmCode = process.env.ConfirmationCode;
  });
  it("Confirmation User", async () => {
    await request(app.getHttpServer())
      .post("/auth/registration-confirmation")
      .send({
        code: firstUser.confirmCode,
      })
      .expect(204);
  });
  it("Confirmation User", async () => {
    await request(app.getHttpServer())
      .post("/auth/registration-confirmation")
      .send({
        code: secondUser.confirmCode,
      })
      .expect(204);
  });
  it("Login User", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        loginOrEmail: firstUser.login,
        password: firstUser.password,
      })
      .expect(200);
    const cookies = res.headers["set-cookie"][0]
      .split(",")
      .map((item) => item.split(";")[0])
      .map((item) => item.split("=")[1]);

    tokensForFirstUser.accessToken = res.body.accessToken;
    tokensForFirstUser.refreshToken = cookies.toString();
  });
  it("Login User", async () => {
    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        loginOrEmail: secondUser.login,
        password: secondUser.password,
      })
      .expect(200);
    const cookies = res.headers["set-cookie"][0]
      .split(",")
      .map((item) => item.split(";")[0])
      .map((item) => item.split("=")[1]);

    tokensForSecondUser.accessToken = res.body.accessToken;
    tokensForSecondUser.refreshToken = cookies.toString();
  });
  it("Create Blogger ", async () => {
    const res = await request(app.getHttpServer())
      .post("/blogs")
      .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
      .send({
        name: blogger.name,
        description: blogger.description,
        websiteUrl: blogger.websiteUrl,
      })
      .expect(201);
    expect(res.body.name).toBe(blogger.name);
    expect(res.body.websiteUrl).toBe(blogger.websiteUrl);

    blogger.id = res.body.id;
    blogger.createdAt = res.body.createdAt;
  });
  it("Create Post for blogger", async () => {
    const res = await request(app.getHttpServer())
      .post("/blogs/" + blogger.id.toString() + "/posts")
      .set({ Authorization: "Basic YWRtaW46cXdlcnR5" })
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
  it("Add Comment", async () => {
    const res = await request(app.getHttpServer())
      .post("/posts/" + firstPost.id.toString() + "/comments")
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .send({
        content: firstComment.content,
      })
      .expect(201);
    firstComment.id = res.body.id;
    firstUser.id = res.body.userId;
    firstComment.userId = res.body.userId;
    firstComment.userLogin = res.body.userLogin;
    firstComment.createdAt = res.body.createdAt;
    expect(firstComment.userId).toBe(firstUser.id);
    expect(firstComment.userLogin).toBe(firstUser.login);
  });
  it("Add Second Comment", async () => {
    const res = await request(app.getHttpServer())
      .post("/posts/" + firstPost.id.toString() + "/comments")
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .send({
        content: secondComment.content,
      })
      .expect(201);
    secondComment.id = res.body.id;
    secondComment.userId = res.body.userId;
    secondComment.userLogin = res.body.userLogin;
    secondComment.createdAt = res.body.createdAt;
    expect(secondComment.userId).toBe(firstUser.id);
    expect(secondComment.userLogin).toBe(firstUser.login);
  });

  it("Like First Comment", async () => {
    const res = await request(app.getHttpServer())
      .put("/comments/" + firstComment.id.toString() + "/like-status")
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .send({
        likeStatus: "Like",
      })
      .expect(204);
  });

  it("Get Comment", async () => {
    const res = await request(app.getHttpServer())
      .get("/comments/" + firstComment.id.toString())
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .expect(200)
      .expect({
        id: firstComment.id,
        content: firstComment.content,
        userId: firstUser.id,
        userLogin: firstUser.login,
        createdAt: firstComment.createdAt,
        likesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: "Like",
        },
      });
  });
  it("Dislike Second comment", async () => {
    const res = await request(app.getHttpServer())
      .put("/comments/" + firstComment.id.toString() + "/like-status")
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .send({
        likeStatus: "Dislike",
      })
      .expect(204);
  });
  it("None Second comment", async () => {
    const res = await request(app.getHttpServer())
      .put("/comments/" + firstComment.id.toString() + "/like-status")
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .send({
        likeStatus: "None",
      })
      .expect(204);
  });
  it("Get Comment", async () => {
    const res = await request(app.getHttpServer())
      .get("/comments/" + firstComment.id.toString())
      .set("Authorization", `Bearer ${tokensForFirstUser.accessToken}`)
      .expect(200)
      .expect({
        id: firstComment.id,
        content: firstComment.content,
        userId: firstUser.id,
        userLogin: firstUser.login,
        createdAt: firstComment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: "None",
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
