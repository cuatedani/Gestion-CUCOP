import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import {
  ICreateSupplier,
  IUpdateSupplier,
} from "../../../../src/backend/models/supplier";

describe("Suppliers", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/suppliers", async () => {
    await Utils.createSupplier(true);
    const { text } = await request(app).get("/time/api/suppliers");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/suppliers/:id", async () => {
    const supplierId = await Utils.createSupplier(true);
    const { text } = await request(app).get(`/time/api/suppliers/${supplierId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/suppliers", async () => {
    const data: ICreateSupplier = {
      contactId: await Utils.createContact(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/suppliers").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/suppliers/:id", async () => {
    const supplierId = await Utils.createSupplier(true);
    const data: IUpdateSupplier = {
      contactId: await Utils.createContact(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/suppliers/${supplierId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/suppliers/:id", async () => {
    const supplierId = await Utils.createSupplier(true);
    const { text } = await request(app).delete(`/time/api/suppliers/${supplierId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
