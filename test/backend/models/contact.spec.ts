import Utils from "../utils";
import Contact, { IContact } from "../../../src/backend/models/contact";
import { faker } from "@faker-js/faker";

describe("Contact model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an contact", async () => {
    const contact = await Utils.createContact();
    expect(contact).not.toBe(-1);
  });

  it("Should check if an contact exists", async () => {
    const contactId = await Utils.createContact();
    const exist = await Contact.exists(contactId);
    expect(exist).toBe(true);
  });

  it("Should check if an contact doesn't exists", async () => {
    const exist = await Contact.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active contacts", async () => {
    await Utils.createContact(true);
    await Utils.createContact(true);
    await Utils.createContact(true);
    await Utils.createContact(false);
    const contacts = await Contact.getAll({ status: "active" });
    expect(contacts).toHaveLength(3);
  });

  it("Should get inactive contacts", async () => {
    await Utils.createContact(true);
    await Utils.createContact(true);
    await Utils.createContact(true);
    await Utils.createContact(false);
    const contacts = await Contact.getAll({ status: "inactive" });
    expect(contacts).toHaveLength(1);
  });

  it("Should get all contacts sorted asc", async () => {
    const expected = [
      await Utils.createContact(true),
      await Utils.createContact(true),
      await Utils.createContact(true),
      await Utils.createContact(false),
    ].sort((a, b) => a - b);
    const contacts = await Contact.getAll({
      sort: "asc",
    });
    const obtained = contacts.map((u: IContact) => u.contactId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all contacts sorted desc, limited and inactive", async () => {
    await Utils.createContact(true);
    await Utils.createContact(true);
    await Utils.createContact(true);
    const expected = [await Utils.createContact(false)].sort((a, b) => b - a);
    const contacts = await Contact.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = contacts.map((u: IContact) => u.contactId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an contact by id", async () => {
    const contactId = await Utils.createContact(true);
    const contact = await Contact.getById(contactId);
    expect(contact).not.toBe(undefined);
  });

  it("Should not get an contact because it's id doesn't exist", async () => {
    const contact = await Contact.getById(-1);
    expect(contact).toBe(undefined);
  });

  it("Should update an contact", async () => {
    const contactId = await Utils.createContact();
    const update = await Contact.update(contactId, {
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
    });
    expect(update).toBe(true);
  });

  it("Should not update an contact", async () => {
    const update = await Contact.update(-1, {
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
    });
    expect(update).toBe(false);
  });

  it("Should remove an contact", async () => {
    const contactId = await Utils.createContact();
    const remove = await Contact.remove(contactId);
    expect(remove).toBe(true);
  });

  it("Should not remove an contact", async () => {
    const remove = await Contact.remove(1);
    expect(remove).toBe(false);
  });
});
