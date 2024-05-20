import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateIncome,
  IUpdateIncome,
} from "../../../../src/backend/models/income";

describe("Incomes", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/incomes", async () => {
    await Utils.createIncome(true);
    const { text } = await request(app).get("/time/api/incomes");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/incomes/:id", async () => {
    const incomeId = await Utils.createIncome(true);
    const { text } = await request(app).get(`/time/api/incomes/${incomeId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/incomes", async () => {
    const supplierId = await Utils.createSupplier(true);
    const customerId = await Utils.createCustomer(true);
    const projectId = await Utils.createProject(true);
    const accountId = await Utils.createAccount(true);
    const data: ICreateIncome = {
      projectId,
      accountId,
      supplierId,
      customerId,
      total: faker.datatype.number(10000),
      tax: faker.datatype.number(10000),
      discount: faker.datatype.number(10000),
      subtotal: faker.datatype.number(10000),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/incomes").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/incomes/:id", async () => {
    const supplierId = await Utils.createSupplier(true);
    const customerId = await Utils.createCustomer(true);
    const projectId = await Utils.createProject(true);
    const accountId = await Utils.createAccount(true);
    const incomeId = await Utils.createIncome(true);
    const data: IUpdateIncome = {
      projectId,
      accountId,
      supplierId,
      customerId,
      total: faker.datatype.number(10000),
      tax: faker.datatype.number(10000),
      discount: faker.datatype.number(10000),
      subtotal: faker.datatype.number(10000),
      description: faker.random.word(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/incomes/${incomeId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/incomes/:id", async () => {
    const incomeId = await Utils.createIncome(true);
    const { text } = await request(app).delete(`/time/api/incomes/${incomeId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
