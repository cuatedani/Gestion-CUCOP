import Utils from "../utils";
import Category, { ICategory } from "../../../src/backend/models/category";
import { faker } from "@faker-js/faker";

describe("Category model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an category", async () => {
    const category = await Utils.createCategory();
    expect(category).not.toBe(-1);
  });

  it("Should check if an category exists", async () => {
    const categoryId = await Utils.createCategory();
    const exist = await Category.exists(categoryId);
    expect(exist).toBe(true);
  });

  it("Should check if an category doesn't exists", async () => {
    const exist = await Category.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active categorys", async () => {
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    await Utils.createCategory(false);
    const categorys = await Category.getAll({ status: "active" });
    expect(categorys).toHaveLength(3);
  });

  it("Should get inactive categorys", async () => {
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    await Utils.createCategory(false);
    const categorys = await Category.getAll({ status: "inactive" });
    expect(categorys).toHaveLength(1);
  });

  it("Should get all categorys sorted asc", async () => {
    const expected = [
      await Utils.createCategory(true),
      await Utils.createCategory(true),
      await Utils.createCategory(true),
      await Utils.createCategory(false),
    ].sort((a, b) => a - b);
    const categorys = await Category.getAll({
      sort: "asc",
    });
    const obtained = categorys.map((u: ICategory) => u.categoryId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all categorys sorted desc, limited and inactive", async () => {
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    await Utils.createCategory(true);
    const expected = [await Utils.createCategory(false)].sort((a, b) => b - a);
    const categorys = await Category.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = categorys.map((u: ICategory) => u.categoryId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an category by id", async () => {
    const categoryId = await Utils.createCategory(true);
    const category = await Category.getById(categoryId);
    expect(category).not.toBe(undefined);
  });

  it("Should not get an category because it's id doesn't exist", async () => {
    const category = await Category.getById(-1);
    expect(category).toBe(undefined);
  });

  it("Should update an category", async () => {
    const categoryId = await Utils.createCategory();
    const update = await Category.update(categoryId, {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an category", async () => {
    const update = await Category.update(-1, {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an category", async () => {
    const categoryId = await Utils.createCategory();
    const remove = await Category.remove(categoryId);
    expect(remove).toBe(true);
  });

  it("Should not remove an category", async () => {
    const remove = await Category.remove(1);
    expect(remove).toBe(false);
  });
});
