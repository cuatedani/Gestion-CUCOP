import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import {
  ICreateCustomer,
  IUpdateCustomer,
} from "../../../../src/backend/models/customer";

describe("Customers", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/customers", async () => {
    await Utils.createCustomer(true);
    const { text } = await request(app).get("/time/api/customers");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/customers/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const { text } = await request(app).get(`/time/api/customers/${customerId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/customers", async () => {
    const data: ICreateCustomer = {
      contactId: await Utils.createContact(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/customers").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/customers/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const data: IUpdateCustomer = {
      contactId: await Utils.createContact(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/customers/${customerId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/customers/:id", async () => {
    const customerId = await Utils.createCustomer(true);
    const { text } = await request(app).delete(`/time/api/customers/${customerId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
