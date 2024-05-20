import Utils from "../utils";
import Area, { IArea } from "../../../src/backend/models/area";
import { faker } from "@faker-js/faker";

describe("Area model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an area", async () => {
    const area = await Utils.createArea();
    expect(area).not.toBe(-1);
  });

  it("Should check if an area exists", async () => {
    const areaId = await Utils.createArea();
    const exist = await Area.exists(areaId);
    expect(exist).toBe(true);
  });

  it("Should check if an area doesn't exists", async () => {
    const exist = await Area.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active areas", async () => {
    await Utils.createArea(true);
    await Utils.createArea(true);
    await Utils.createArea(true);
    await Utils.createArea(false);
    const areas = await Area.getAll({ status: "active" });
    expect(areas).toHaveLength(3);
  });

  it("Should get inactive areas", async () => {
    await Utils.createArea(true);
    await Utils.createArea(true);
    await Utils.createArea(true);
    await Utils.createArea(false);
    const areas = await Area.getAll({ status: "inactive" });
    expect(areas).toHaveLength(1);
  });

  it("Should get all areas sorted asc", async () => {
    const expected = [
      await Utils.createArea(true),
      await Utils.createArea(true),
      await Utils.createArea(true),
      await Utils.createArea(false),
    ].sort((a, b) => a - b);
    const areas = await Area.getAll({
      sort: "asc",
    });
    const obtained = areas.map((u: IArea) => u.areaId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all areas sorted desc, limited and inactive", async () => {
    await Utils.createArea(true);
    await Utils.createArea(true);
    await Utils.createArea(true);
    const expected = [await Utils.createArea(false)].sort((a, b) => b - a);
    const areas = await Area.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = areas.map((u: IArea) => u.areaId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an area by id", async () => {
    const areaId = await Utils.createArea(true);
    const area = await Area.getById(areaId);
    expect(area).not.toBe(undefined);
  });

  it("Should not get an area because it's id doesn't exist", async () => {
    const area = await Area.getById(-1);
    expect(area).toBe(undefined);
  });

  it("Should update an area", async () => {
    const areaId = await Utils.createArea();
    const update = await Area.update(areaId, {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an area", async () => {
    const update = await Area.update(-1, {
      main: faker.random.word(),
      second: faker.random.word(),
      thirth: faker.random.word(),
      description: faker.random.word(),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an area", async () => {
    const areaId = await Utils.createArea();
    const remove = await Area.remove(areaId);
    expect(remove).toBe(true);
  });

  it("Should not remove an area", async () => {
    const remove = await Area.remove(1);
    expect(remove).toBe(false);
  });
});
