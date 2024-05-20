import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateProduct,
  IUpdateProduct,
} from "../../../../src/backend/models/product";

describe("Products", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/products", async () => {
    await Utils.createProduct(true);
    const { text } = await request(app).get("/time/api/products");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/products/:id", async () => {
    const productId = await Utils.createProduct(true);
    const { text } = await request(app).get(`/time/api/products/${productId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/products", async () => {
    const areaId = await Utils.createArea();
    const categoryId = await Utils.createCategory();
    const locationId = await Utils.createLocation();
    const data: ICreateProduct = {
      areaId,
      categoryId,
      locationId,
      name: faker.commerce.product(),
      billName: faker.random.alphaNumeric(5),
      description: faker.commerce.productDescription(),
      stockNumber: faker.random.alphaNumeric(5),
      urlImage: faker.internet.url(),
      urlLink: faker.internet.url(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/products").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/products/:id", async () => {
    const areaId = await Utils.createArea();
    const categoryId = await Utils.createCategory();
    const locationId = await Utils.createLocation();
    const productId = await Utils.createProduct(true);
    const data: IUpdateProduct = {
      areaId,
      categoryId,
      locationId,
      name: faker.commerce.product(),
      billName: faker.random.alphaNumeric(5),
      description: faker.commerce.productDescription(),
      stockNumber: faker.random.alphaNumeric(5),
      urlImage: faker.internet.url(),
      urlLink: faker.internet.url(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/products/${productId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/products/:id", async () => {
    const productId = await Utils.createProduct(true);
    const { text } = await request(app).delete(`/time/api/products/${productId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
