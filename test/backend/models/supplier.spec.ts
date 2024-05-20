import Utils from "../utils";
import Supplier, { ISupplier } from "../../../src/backend/models/supplier";

describe("Supplier model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an supplier", async () => {
    const supplier = await Utils.createSupplier();
    expect(supplier).not.toBe(-1);
  });

  it("Should check if an supplier exists", async () => {
    const supplierId = await Utils.createSupplier();
    const exist = await Supplier.exists(supplierId);
    expect(exist).toBe(true);
  });

  it("Should check if an supplier doesn't exists", async () => {
    const exist = await Supplier.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active suppliers", async () => {
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    await Utils.createSupplier(false);
    const suppliers = await Supplier.getAll({ status: "active" });
    expect(suppliers).toHaveLength(3);
  });

  it("Should get inactive suppliers", async () => {
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    await Utils.createSupplier(false);
    const suppliers = await Supplier.getAll({ status: "inactive" });
    expect(suppliers).toHaveLength(1);
  });

  it("Should get all suppliers sorted asc", async () => {
    const expected = [
      await Utils.createSupplier(true),
      await Utils.createSupplier(true),
      await Utils.createSupplier(true),
      await Utils.createSupplier(false),
    ].sort((a, b) => a - b);
    const suppliers = await Supplier.getAll({
      sort: "asc",
    });
    const obtained = suppliers.map((u: ISupplier) => u.supplierId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all suppliers sorted desc, limited and inactive", async () => {
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    await Utils.createSupplier(true);
    const expected = [await Utils.createSupplier(false)].sort((a, b) => b - a);
    const suppliers = await Supplier.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = suppliers.map((u: ISupplier) => u.supplierId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an supplier by id", async () => {
    const supplierId = await Utils.createSupplier(true);
    const supplier = await Supplier.getById(supplierId);
    expect(supplier).not.toBe(undefined);
  });

  it("Should not get an supplier because it's id doesn't exist", async () => {
    const supplier = await Supplier.getById(-1);
    expect(supplier).toBe(undefined);
  });

  it("Should update an supplier", async () => {
    const supplierId = await Utils.createSupplier();
    const contactId = await Utils.createContact();
    const update = await Supplier.update(supplierId, {
      contactId,
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an supplier", async () => {
    const contactId = await Utils.createContact();
    const update = await Supplier.update(-1, {
      contactId,
      active: false,
    });
    expect(update).toBe(false);
  });

  it("Should remove an supplier", async () => {
    const supplierId = await Utils.createSupplier();
    const remove = await Supplier.remove(supplierId);
    expect(remove).toBe(true);
  });

  it("Should not remove an supplier", async () => {
    const remove = await Supplier.remove(1);
    expect(remove).toBe(false);
  });
});
