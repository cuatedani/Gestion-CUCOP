import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import { ICreateUser } from "../../../../src/backend/models/user";

describe("Users", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/users", async () => {
    await Utils.createUser(true);
    const { text } = await request(app).get("/time/api/users");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/users/:id", async () => {
    const userId = await Utils.createUser(true);
    const { text } = await request(app).get(`/time/api/users/${userId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/users", async () => {
    const data = {
      userName: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/users").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/users/:id", async () => {
    const userId = await Utils.createUser(true);
    const data: ICreateUser = {
      userName: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: true,
    };
    const { text } = await request(app).put(`/time/api/users/${userId}`).send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/users/:id", async () => {
    const userId = await Utils.createUser(true);
    const { text } = await request(app).delete(`/time/api/users/${userId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
