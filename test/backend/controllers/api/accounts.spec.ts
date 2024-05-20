import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import {
  ICreateAccount,
  IUpdateAccount,
} from "../../../../src/backend/models/account";
import { faker } from "@faker-js/faker";

describe("Accounts", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/accounts", async () => {
    await Utils.createAccount(true);
    const { statusCode } = await request(app).get("/time/api/accounts");
    expect(statusCode).toBe(200);
  });

  it("should respond the GET route /time/api/accounts/:id", async () => {
    const accountId = await Utils.createAccount(true);
    const { statusCode } = await request(app).get(`/time/api/accounts/${accountId}`);
    expect(statusCode).toBe(200);
  });

  it("should respond the POST route /time/api/accounts", async () => {
    const customerId = await Utils.createCustomer(true);
    const data: ICreateAccount = {
      customerId,
      name: faker.random.word(),
      description: faker.random.words(),
      number: Math.floor(Math.random() * 100),
      active: true,
    };
    const { statusCode } = await request(app).post("/time/api/accounts").send(data);
    expect(statusCode).toBe(200);
  });

  it("should respond the PUT route /time/api/accounts/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const accountId = await Utils.createAccount(true);
    const data: IUpdateAccount = {
      customerId,
      name: faker.random.word(),
      description: faker.random.words(),
      number: Math.floor(Math.random() * 100),
      active: true,
    };
    const { statusCode } = await request(app)
      .put(`/time/api/accounts/${accountId}`)
      .send(data);
    expect(statusCode).toBe(200);
  });

  it("should respond the DELETE route /time/api/accounts/:id", async () => {
    const accountId = await Utils.createAccount(true);
    const { statusCode } = await request(app).delete(
      `/time/api/accounts/${accountId}`
    );
    expect(statusCode).toBe(200);
  });
});
