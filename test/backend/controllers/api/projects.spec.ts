import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateProject,
  IUpdateProject,
} from "../../../../src/backend/models/project";

describe("Projects", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/projects", async () => {
    await Utils.createProject(true);
    const { text } = await request(app).get("/time/api/projects");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/projects/:id", async () => {
    const projectId = await Utils.createProject(true);
    const { text } = await request(app).get(`/time/api/projects/${projectId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/projects", async () => {
    const customerId = await Utils.createCustomer(true);
    const data: ICreateProject = {
      customerId: customerId,
      name: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/projects").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/projects/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const projectId = await Utils.createProject(true);
    const data: IUpdateProject = {
      customerId,
      name: faker.random.word(),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/projects/${projectId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/projects/:id", async () => {
    const projectId = await Utils.createProject(true);
    const { text } = await request(app).delete(`/time/api/projects/${projectId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
