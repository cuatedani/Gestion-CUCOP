import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import { ICreateArea, IUpdateArea } from "../../../../src/backend/models/area";

describe("Areas", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/areas", async () => {
    await Utils.createArea(true);
    const { statusCode } = await request(app).get("/time/api/areas");
    expect(statusCode).toBe(200);
  });

  it("should respond the GET route /time/api/areas/:id", async () => {
    const areaId = await Utils.createArea(true);
    const { statusCode } = await request(app).get(`/time/api/areas/${areaId}`);
    expect(statusCode).toBe(200);
  });

  it("should respond the POST route /time/api/areas", async () => {
    const data: ICreateArea = {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { statusCode } = await request(app).post("/time/api/areas").send(data);
    expect(statusCode).toBe(200);
  });

  it("should respond the PUT route /time/api/areas/:id", async () => {
    const areaId = await Utils.createArea(true);
    const data: IUpdateArea = {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { statusCode } = await request(app)
      .put(`/time/api/areas/${areaId}`)
      .send(data);
    expect(statusCode).toBe(200);
  });

  it("should respond the DELETE route /time/api/areas/:id", async () => {
    const areaId = await Utils.createArea(true);
    const { statusCode } = await request(app).delete(`/time/api/areas/${areaId}`);
    expect(statusCode).toBe(200);
  });
});
