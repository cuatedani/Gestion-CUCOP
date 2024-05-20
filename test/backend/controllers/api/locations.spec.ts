import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateLocation,
  IUpdateLocation,
} from "../../../../src/backend/models/location";

describe("Locations", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(async () => {
    app.close();
    await Utils.closeConnection();
  });

  it("should respond the GET route /time/api/locations", async () => {
    await Utils.createLocation(true);
    const { text } = await request(app).get("/time/api/locations");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/locations/:id", async () => {
    const locationId = await Utils.createLocation(true);
    const { text } = await request(app).get(`/time/api/locations/${locationId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/locations", async () => {
    const data: ICreateLocation = {
      roomNumber: faker.random.alphaNumeric(2),
      building: faker.name.firstName(),
      room: faker.random.alphaNumeric(2),
      lockerNumber: faker.random.alphaNumeric(2),
      locker: faker.random.alphaNumeric(2),
      container: "Caja de Cartón",
      active: true,
    };
    const { text } = await request(app).post("/time/api/locations").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/locations/:id", async () => {
    const locationId = await Utils.createLocation(true);
    const data: IUpdateLocation = {
      roomNumber: faker.random.alphaNumeric(2),
      building: faker.name.firstName(),
      room: faker.random.alphaNumeric(2),
      lockerNumber: faker.random.alphaNumeric(2),
      locker: faker.random.alphaNumeric(2),
      container: "Caja de Cartón",
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/locations/${locationId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/locations/:id", async () => {
    const locationId = await Utils.createLocation(true);
    const { text } = await request(app).delete(`/time/api/locations/${locationId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
