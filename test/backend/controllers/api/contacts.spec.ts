import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";
import { faker } from "@faker-js/faker";
import {
  ICreateContact,
  IUpdateContact,
} from "../../../../src/backend/models/contact";

describe("Contacts", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the GET route /time/api/contacts", async () => {
    await Utils.createContact(true);
    const { text } = await request(app).get("/time/api/contacts");
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the GET route /time/api/contacts/:id", async () => {
    const contactId = await Utils.createContact(true);
    const { text } = await request(app).get(`/time/api/contacts/${contactId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the POST route /time/api/contacts", async () => {
    const data: ICreateContact = {
      name: faker.name.firstName(),
      country: faker.address.country(),
      state: faker.address.state(),
      municipality: faker.address.city(),
      suburb: "Centro",
      street: faker.address.street(),
      cardinalPoint: faker.address.cardinalDirection(),
      number: faker.datatype.string(),
      cp: faker.datatype.number({ min: 10000, max: 99999 }),
      phone1: faker.phone.phoneNumber("### ### ####"),
      phone2: faker.phone.phoneNumber("### ### ####"),
      email1: faker.internet.email(),
      email2: faker.internet.email(),
      web: faker.internet.url(),
      active: true,
    };
    const { text } = await request(app).post("/time/api/contacts").send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the PUT route /time/api/contacts/:id", async () => {
    const contactId = await Utils.createContact(true);
    const data: IUpdateContact = {
      name: faker.name.firstName(),
      country: faker.address.country(),
      state: faker.address.state(),
      municipality: faker.address.city(),
      suburb: "Centro",
      street: faker.address.street(),
      cardinalPoint: faker.address.cardinalDirection(),
      number: faker.datatype.string(),
      cp: faker.datatype.number({ min: 10000, max: 99999 }),
      phone1: faker.phone.phoneNumber("### ### ####"),
      phone2: faker.phone.phoneNumber("### ### ####"),
      email1: faker.internet.email(),
      email2: faker.internet.email(),
      web: faker.internet.url(),
      active: true,
    };
    const { text } = await request(app)
      .put(`/time/api/contacts/${contactId}`)
      .send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("should respond the DELETE route /time/api/contacts/:id", async () => {
    const contactId = await Utils.createContact(true);
    const { text } = await request(app).delete(`/time/api/contacts/${contactId}`);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });
});
