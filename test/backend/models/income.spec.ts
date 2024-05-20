import Utils from "../utils";
import Income, { IIncome } from "../../../src/backend/models/income";
import { faker } from "@faker-js/faker";

describe("Income model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an income", async () => {
    const incomeId = await Utils.createIncome(true);
    expect(incomeId).not.toBe(-1);
  });

  it("Should check if an income exists", async () => {
    const incomeId = await Utils.createIncome(true);
    const exist = await Income.exists(incomeId);
    expect(exist).toBe(true);
  });

  it("Should check if an income doesn't exists", async () => {
    const exist = await Income.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active incomes", async () => {
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    await Utils.createIncome(false);
    const incomes = await Income.getAll({ status: "active" });
    expect(incomes).toHaveLength(3);
  });

  it("Should get inactive incomes", async () => {
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    await Utils.createIncome(false);
    const incomes = await Income.getAll({ status: "inactive" });
    expect(incomes).toHaveLength(1);
  });

  it("Should get all incomes sorted asc", async () => {
    const expected = [
      await Utils.createIncome(true),
      await Utils.createIncome(true),
      await Utils.createIncome(true),
      await Utils.createIncome(false),
    ].sort((a, b) => a - b);
    const incomes = await Income.getAll({
      sort: "asc",
    });
    const obtained = incomes.map((u: IIncome) => u.incomeId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all incomes sorted desc, limited and inactive", async () => {
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    await Utils.createIncome(true);
    const expected = [await Utils.createIncome(false)].sort((a, b) => b - a);
    const incomes = await Income.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = incomes.map((u: IIncome) => u.incomeId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an income by id", async () => {
    const incomeId = await Utils.createIncome(true);
    const income = await Income.getById(incomeId);
    expect(income).not.toBe(undefined);
  });

  it("Should not get an income because it's id doesn't exist", async () => {
    const income = await Income.getById(-1);
    expect(income).toBe(undefined);
  });

  it("Should update an income", async () => {
    const projectId = await Utils.createProject(true);
    const accountId = await Utils.createAccount(true);
    const supplierId = await Utils.createSupplier(true);
    const customerId = await Utils.createCustomer(true);
    const incomeId = await Utils.createIncome(true, projectId);
    const update = await Income.update(incomeId, {
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
    });
    expect(update).toBe(true);
  });

  it("Should not update an income", async () => {
    const update = await Income.update(-1, {
      projectId: 5,
      accountId: 5,
      supplierId: 5,
      customerId: 5,
      total: faker.datatype.number(10000),
      tax: faker.datatype.number(10000),
      discount: faker.datatype.number(10000),
      subtotal: faker.datatype.number(10000),
      description: faker.random.word(),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an income", async () => {
    const incomeId = await Utils.createIncome(true);
    const remove = await Income.remove(incomeId);
    expect(remove).toBe(true);
  });

  it("Should not remove an income", async () => {
    const remove = await Income.remove(1);
    expect(remove).toBe(false);
  });
});
