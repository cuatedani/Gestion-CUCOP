import Utils from "../utils";
import Account, { IAccount } from "../../../src/backend/models/account";
import { faker } from "@faker-js/faker";

describe("Account model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an account", async () => {
    const accountId = await Utils.createAccount(true);
    expect(accountId).not.toBe(-1);
  });

  it("Should check if an account exists", async () => {
    const accountId = await Utils.createAccount(true);
    const exist = await Account.exists(accountId);
    expect(exist).toBe(true);
  });

  it("Should check if an account doesn't exists", async () => {
    const exist = await Account.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active accounts", async () => {
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    await Utils.createAccount(false);
    const accounts = await Account.getAll({ status: "active" });
    expect(accounts).toHaveLength(3);
  });

  it("Should get inactive accounts", async () => {
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    await Utils.createAccount(false);
    const accounts = await Account.getAll({ status: "inactive" });
    expect(accounts).toHaveLength(1);
  });

  it("Should get all accounts sorted asc", async () => {
    const expected = [
      await Utils.createAccount(true),
      await Utils.createAccount(true),
      await Utils.createAccount(true),
      await Utils.createAccount(false),
    ].sort((a, b) => a - b);
    const accounts = await Account.getAll({
      sort: "asc",
    });
    const obtained = accounts.map((u: IAccount) => u.accountId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all accounts sorted desc, limited and inactive", async () => {
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    await Utils.createAccount(true);
    const expected = [await Utils.createAccount(false)].sort((a, b) => b - a);
    const accounts = await Account.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = accounts.map((u: IAccount) => u.accountId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an account by id", async () => {
    const accountId = await Utils.createAccount(true);
    const account = await Account.getById(accountId);
    expect(account).not.toBe(undefined);
  });

  it("Should not get an account because it's id doesn't exist", async () => {
    const account = await Account.getById(-1);
    expect(account).toBe(undefined);
  });

  it("Should update an account", async () => {
    const customerId = await Utils.createCustomer(true);
    const accountId = await Utils.createAccount(true);
    const update = await Account.update(accountId, {
      customerId,
      name: "name",
      description: "desc",
      number: faker.datatype.number(10000),
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an account", async () => {
    const update = await Account.update(-1, {
      customerId: 5,
      name: "name",
      description: "desc",
      number: faker.datatype.number(10000),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an account", async () => {
    const accountId = await Utils.createAccount(true);
    const remove = await Account.remove(accountId);
    expect(remove).toBe(true);
  });

  it("Should not remove an account", async () => {
    const remove = await Account.remove(1);
    expect(remove).toBe(false);
  });
});
