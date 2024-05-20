import Utils from "../utils";
import Customer, { ICustomer } from "../../../src/backend/models/customer";

describe("Customer model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an customer", async () => {
    const customer = await Utils.createCustomer(true);
    expect(customer).not.toBe(-1);
  });

  it("Should check if an customer exists", async () => {
    const customerId = await Utils.createCustomer();
    const exist = await Customer.exists(customerId);
    expect(exist).toBe(true);
  });

  it("Should check if an customer doesn't exists", async () => {
    const exist = await Customer.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active customers", async () => {
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    await Utils.createCustomer(false);
    const customers = await Customer.getAll({ status: "active" });
    expect(customers).toHaveLength(3);
  });

  it("Should get inactive customers", async () => {
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    await Utils.createCustomer(false);
    const customers = await Customer.getAll({ status: "inactive" });
    expect(customers).toHaveLength(1);
  });

  it("Should get all customers sorted asc", async () => {
    const expected = [
      await Utils.createCustomer(true),
      await Utils.createCustomer(true),
      await Utils.createCustomer(true),
      await Utils.createCustomer(false),
    ].sort((a, b) => a - b);
    const customers = await Customer.getAll({
      sort: "asc",
    });
    const obtained = customers.map((u: ICustomer) => u.customerId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all customers sorted desc, limited and inactive", async () => {
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    await Utils.createCustomer(true);
    const expected = [await Utils.createCustomer(false)].sort((a, b) => b - a);
    const customers = await Customer.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = customers.map((u: ICustomer) => u.customerId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an customer by id", async () => {
    const customerId = await Utils.createCustomer(true);
    const customer = await Customer.getById(customerId);
    expect(customer).not.toBe(undefined);
  });

  it("Should not get an customer because it's id doesn't exist", async () => {
    const customer = await Customer.getById(-1);
    expect(customer).toBe(undefined);
  });

  it("Should update an customer", async () => {
    const customerId = await Utils.createCustomer();
    const contactId = await Utils.createContact();
    const update = await Customer.update(customerId, {
      contactId,
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an customer", async () => {
    const contactId = await Utils.createContact();
    const update = await Customer.update(-1, {
      contactId,
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an customer", async () => {
    const customerId = await Utils.createCustomer();
    const remove = await Customer.remove(customerId);
    expect(remove).toBe(true);
  });

  it("Should not remove an customer", async () => {
    const remove = await Customer.remove(1);
    expect(remove).toBe(false);
  });
});
