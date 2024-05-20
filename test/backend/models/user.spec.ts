import Utils from "../utils";
import User, { IUser } from "../../../src/backend/models/user";
import { faker } from "@faker-js/faker";

describe("Users model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an user", async () => {
    const user = await Utils.createUser();
    expect(user).not.toBe(-1);
  });

  it("Should check if an user exists", async () => {
    const userId = await Utils.createUser();
    const exist = await User.exists(userId);
    expect(exist).toBe(true);
  });

  it("Should check if an user doesn't exists", async () => {
    const exist = await User.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active users", async () => {
    await Utils.createUser(true);
    await Utils.createUser(true);
    await Utils.createUser(true);
    await Utils.createUser(false);
    const users = await User.getAll({ status: "active" });
    expect(users).toHaveLength(3);
  });

  it("Should get inactive users", async () => {
    await Utils.createUser(true);
    await Utils.createUser(true);
    await Utils.createUser(true);
    await Utils.createUser(false);
    const users = await User.getAll({ status: "inactive" });
    expect(users).toHaveLength(1);
  });

  it("Should get all users sorted asc", async () => {
    const expected = [
      await Utils.createUser(true),
      await Utils.createUser(true),
      await Utils.createUser(true),
      await Utils.createUser(false),
    ].sort((a, b) => a - b);
    const users = await User.getAll({
      sort: "asc",
    });
    const obtained = users.map((u: IUser) => u.userId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all users sorted desc, limited and inactive", async () => {
    await Utils.createUser(true);
    await Utils.createUser(true);
    await Utils.createUser(true);
    const expected = [await Utils.createUser(false)].sort((a, b) => b - a);
    const users = await User.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = users.map((u: IUser) => u.userId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an user by id", async () => {
    const userId = await Utils.createUser(true);
    const user = await User.getById(userId);
    expect(user).not.toBe(undefined);
  });

  it("Should not get an user because it's id doesn't exist", async () => {
    const user = await User.getById(-1);
    expect(user).toBe(undefined);
  });

  it("Should update an user", async () => {
    const userId = await Utils.createUser();
    const update = await User.update(userId, {
      userName: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an user", async () => {
    const update = await User.update(-1, {
      userName: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an user", async () => {
    const userId = await Utils.createUser();
    const remove = await User.remove(userId);
    expect(remove).toBe(true);
  });

  it("Should not remove an user", async () => {
    const remove = await User.remove(1);
    expect(remove).toBe(false);
  });
});
