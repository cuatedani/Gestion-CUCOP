import Utils from "../utils";
import Location, { ILocation } from "../../../src/backend/models/location";
import { faker } from "@faker-js/faker";

describe("Location model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an location", async () => {
    const location = await Utils.createLocation();
    expect(location).not.toBe(-1);
  });

  it("Should check if an location exists", async () => {
    const locationId = await Utils.createLocation();
    const exist = await Location.exists(locationId);
    expect(exist).toBe(true);
  });

  it("Should check if an location doesn't exists", async () => {
    const exist = await Location.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active locations", async () => {
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    await Utils.createLocation(false);
    const locations = await Location.getAll({ status: "active" });
    expect(locations).toHaveLength(3);
  });

  it("Should get inactive locations", async () => {
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    await Utils.createLocation(false);
    const locations = await Location.getAll({ status: "inactive" });
    expect(locations).toHaveLength(1);
  });

  it("Should get all locations sorted asc", async () => {
    const expected = [
      await Utils.createLocation(true),
      await Utils.createLocation(true),
      await Utils.createLocation(true),
      await Utils.createLocation(false),
    ].sort((a, b) => a - b);
    const locations = await Location.getAll({
      sort: "asc",
    });
    const obtained = locations.map((u: ILocation) => u.locationId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all locations sorted desc, limited and inactive", async () => {
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    await Utils.createLocation(true);
    const expected = [await Utils.createLocation(false)].sort((a, b) => b - a);
    const locations = await Location.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = locations.map((u: ILocation) => u.locationId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an location by id", async () => {
    const locationId = await Utils.createLocation(true);
    const location = await Location.getById(locationId);
    expect(location).not.toBe(undefined);
  });

  it("Should not get an location because it's id doesn't exist", async () => {
    const location = await Location.getById(-1);
    expect(location).toBe(undefined);
  });

  it("Should update an location", async () => {
    const locationId = await Utils.createLocation();
    const update = await Location.update(locationId, {
      building: faker.name.firstName(),
      roomNumber: faker.random.alphaNumeric(2),
      room: faker.random.alphaNumeric(2),
      lockerNumber: faker.random.alphaNumeric(2),
      locker: faker.random.alphaNumeric(2),
      container: "Caja de Cartón",
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an location", async () => {
    const update = await Location.update(-1, {
      building: faker.name.firstName(),
      roomNumber: faker.random.alphaNumeric(2),
      room: faker.random.alphaNumeric(2),
      lockerNumber: faker.random.alphaNumeric(2),
      locker: faker.random.alphaNumeric(2),
      container: "Caja de Cartón",
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an location", async () => {
    const locationId = await Utils.createLocation();
    const remove = await Location.remove(locationId);
    expect(remove).toBe(true);
  });

  it("Should not remove an location", async () => {
    const remove = await Location.remove(1);
    expect(remove).toBe(false);
  });
});
