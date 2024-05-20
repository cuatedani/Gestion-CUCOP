import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateAssignment,
  IUpdateAssignment,
  AssignmentStatus,
} from "../../../../src/backend/models/assignment";

describe("Categotys", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("Should respond the GET route /time/api/assignments", async () => {
    await Utils.createAssignment(true);
    const { text } = await request(app).get("/time/api/assignments");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("Should respond the GET route /time/api/assignments/:id", async () => {
    const assignmentId = await Utils.createAssignment(true);
    const { text } = await request(app).get(`/time/api/assignments/${assignmentId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("Should respond the POST route /time/api/assignments", async () => {
    const customerId = await Utils.createCustomer(true);
    const data: ICreateAssignment = {
      customerId,
      comments: faker.lorem.sentence(5),
      status: AssignmentStatus.OnLoan,
      returningDate: "2023-06-15 11:50:59",
      active: true,
    };
    const { text } = await request(app).post("/time/api/assignments").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("Should respond the PUT route /time/api/assignments/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const assignmentId = await Utils.createAssignment(true);
    const data: IUpdateAssignment = {
      customerId,
      comments: faker.lorem.sentence(5),
      status: AssignmentStatus.OnLoan,
      returningDate: "2023-06-15 11:50:59",
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/assignments/${assignmentId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("Should respond the DELETE route /time/api/assignments/:id", async () => {
    const assignmentId = await Utils.createAssignment(true);
    const { text } = await request(app).delete(
      `/time/api/assignments/${assignmentId}`
    );
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
