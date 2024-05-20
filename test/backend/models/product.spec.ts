import Utils from "../utils";
import Product, { IProduct } from "../../../src/backend/models/product";
import { faker } from "@faker-js/faker";

describe("Product model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an product", async () => {
    const productId = await Utils.createProduct(true);
    expect(productId).not.toBe(-1);
  });

  it("Should check if an product exists", async () => {
    const productId = await Utils.createProduct(true);
    const exist = await Product.exists(productId);
    expect(exist).toBe(true);
  });

  it("Should check if an product doesn't exists", async () => {
    const exist = await Product.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active products", async () => {
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    await Utils.createProduct(false);
    const products = await Product.getAll({ status: "active" });
    expect(products).toHaveLength(3);
  });

  it("Should get inactive products", async () => {
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    await Utils.createProduct(false);
    const products = await Product.getAll({ status: "inactive" });
    expect(products).toHaveLength(1);
  });

  it("Should get all products sorted asc", async () => {
    const expected = [
      await Utils.createProduct(true),
      await Utils.createProduct(true),
      await Utils.createProduct(true),
      await Utils.createProduct(false),
    ].sort((a, b) => a - b);
    const products = await Product.getAll({
      sort: "asc",
    });
    const obtained = products.map((u: IProduct) => u.productId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all products sorted desc, limited and inactive", async () => {
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    await Utils.createProduct(true);
    const expected = [await Utils.createProduct(false)].sort((a, b) => b - a);
    const products = await Product.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = products.map((u: IProduct) => u.productId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an product by id", async () => {
    const productId = await Utils.createProduct(true);
    const product = await Product.getById(productId);
    expect(product).not.toBe(undefined);
  });

  it("Should not get an product because it's id doesn't exist", async () => {
    const product = await Product.getById(-1);
    expect(product).toBe(undefined);
  });

  it("Should update an product", async () => {
    const areaId = await Utils.createArea();
    const categoryId = await Utils.createCategory();
    const locationId = await Utils.createLocation();
    const productId = await Utils.createProduct(true);
    const update = await Product.update(productId, {
      areaId: areaId,
      categoryId: categoryId,
      locationId: locationId,
      name: faker.commerce.product(),
      billName: faker.random.alphaNumeric(5),
      description: faker.commerce.productDescription(),
      stockNumber: faker.random.alphaNumeric(5),
      urlImage: faker.internet.url(),
      urlLink: faker.internet.url(),
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an product", async () => {
    const update = await Product.update(-1, {
      areaId: 5,
      categoryId: 5,
      locationId: 5,
      name: faker.commerce.product(),
      billName: faker.random.alphaNumeric(5),
      description: faker.commerce.productDescription(),
      stockNumber: faker.random.alphaNumeric(5),
      urlImage: faker.internet.url(),
      urlLink: faker.internet.url(),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an product", async () => {
    const productId = await Utils.createProduct(true);
    const remove = await Product.remove(productId);
    expect(remove).toBe(true);
  });

  it("Should not remove an product", async () => {
    const remove = await Product.remove(1);
    expect(remove).toBe(false);
  });
});
