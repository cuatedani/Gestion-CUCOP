import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateCategory,
  IUpdateCategory,
} from "../../../../src/backend/models/category";

describe("Categotys", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/categories", async () => {
    await Utils.createCategory(true);
    const { text } = await request(app).get("/time/api/categories");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/categories/:id", async () => {
    const categoryId = await Utils.createCategory(true);
    const { text } = await request(app).get(`/time/api/categories/${categoryId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/categories", async () => {
    const data: ICreateCategory = {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/categories").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/categories/:id", async () => {
    const categoryId = await Utils.createCategory(true);
    const data: IUpdateCategory = {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/categories/${categoryId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/categories/:id", async () => {
    const categoryId = await Utils.createCategory(true);
    const { text } = await request(app).delete(`/time/api/categories/${categoryId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
