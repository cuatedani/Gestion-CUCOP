import db from "../../src/backend/database";
import { faker } from "@faker-js/faker";
import User from "../../src/backend/models/user";
import Contact from "../../src/backend/models/contact";
import Customer from "../../src/backend/models/customer";

import Supplier from "../../src/backend/models/supplier";
import Location from "../../src/backend/models/location";
import Category from "../../src/backend/models/category";
import Area from "../../src/backend/models/area";
import Account from "../../src/backend/models/account";
import Project from "../../src/backend/models/project";
import Income from "../../src/backend/models/income";
import Assignment, {
  AssignmentStatus,
} from "../../src/backend/models/assignment";
import Product from "../../src/backend/models/product";

const cleanDataBase = async () => {
  await db.query(`delete from contacts`);
  await db.query(`delete from customers`);
  await db.query(`delete from projects`);
  await db.query(`delete from suppliers`);
  await db.query(`delete from accounts`);
  await db.query(`delete from assignments_products`);
  await db.query(`delete from incomes_products`);
  await db.query(`delete from products`);
  await db.query(`delete from areas`);
  await db.query(`delete from locations`);
  await db.query(`delete from categories`);
  await db.query(`delete from assignments`);
  await db.query(`delete from incomes`);
  await db.query(`delete from users`);
};

const closeConnection = async () => {
  await db.end();
};

const createContact = async (active = false) => {
  return Contact.create({
    name: faker.name.firstName(),
    country: faker.address.country(),
    state: faker.address.state(),
    municipality: faker.address.city(),
    suburb: "Centro",
    street: faker.address.street(),
    cardinalPoint: faker.address.cardinalDirection(),
    number: faker.datatype.string(),
    cp: "" + faker.datatype.number({ min: 10000, max: 99999 }),
    phone1: faker.phone.phoneNumber("### ### ####"),
    phone2: faker.phone.phoneNumber("### ### ####"),
    email1: faker.internet.email(),
    email2: faker.internet.email(),
    web: faker.internet.url(),
    type: "Interno",
    active,
  });
};

const createUser = async (active = false, email = "", password = "") => {
  const email_ = email ? email : faker.internet.email();
  const password_ = password ? password : faker.internet.password();
  return User.create({
    firstNames: faker.name.firstName(),
    lastNames: faker.name.lastName(),
    rol: "",
    email: email_,
    password: password_,
    active,
  });
};

const createSupplier = async (active = false) => {
  const contactId = await createContact(true);
  return Supplier.create({
    contactId,
    active,
  });
};

const createLocation = async (active = false) => {
  return Location.create({
    building: faker.name.firstName(),
    roomNumber: faker.random.alphaNumeric(2),
    room: faker.random.alphaNumeric(2),
    lockerNumber: faker.random.alphaNumeric(2),
    locker: faker.random.alphaNumeric(2),
    container: "Caja de Cartón",
    active,
  });
};

const createCustomer = async (active = false) => {
  const contactId = await createContact(true);
  return Customer.create({
    contactId: contactId,
    rol: "",
    institution: "",
    targetHours: 100,
    adjustHours: 1,
    hoursElapsed: 3,
    active: active,
  });
};

const createCategory = async (active = false) => {
  return Category.create({
    main: faker.commerce.productAdjective(),
    second: faker.commerce.productAdjective(),
    thirth: faker.commerce.productAdjective(),
    description: faker.random.word(),
    active,
  });
};

const createArea = async (active = false) => {
  return Area.create({
    main: faker.commerce.department(),
    second: faker.commerce.department(),
    thirth: faker.commerce.department(),
    description: faker.random.word(),
    active,
  });
};

const createAccount = async (active = false, customerId = -1) => {
  return Account.create({
    customerId: customerId == -1 ? await createCustomer(true) : customerId,
    number: faker.datatype.number(10000),
    name: faker.random.alpha(10),
    description: faker.random.alpha(10),
    active,
  });
};

const createProject = async (active = false, customerId = -1) => {
  return Project.create({
    customerId: customerId == -1 ? await createCustomer(true) : customerId,
    name: faker.random.word(),
    description: faker.random.alpha(10),
    active,
  });
};

const createIncome = async (
  active = false,
  projectId = -1,
  accountId = -1,
  supplierId = -1,
  customerId = -1,
) => {
  return Income.create({
    projectId: projectId == -1 ? await createProject(true) : projectId,
    accountId: accountId == -1 ? await createAccount(true) : accountId,
    supplierId: supplierId == -1 ? await createSupplier(true) : supplierId,
    customerId: customerId == -1 ? await createCustomer(true) : customerId,
    total: faker.datatype.number(10000),
    tax: faker.datatype.number(10000),
    discount: faker.datatype.number(10000),
    subtotal: faker.datatype.number(10000),
    description: faker.random.word(),
    active,
  });
};

const createAssignment = async (active = false, customerId = -1) => {
  return Assignment.create({
    customerId: customerId == -1 ? await createCustomer(true) : customerId,
    comments: faker.lorem.sentence(5),
    status: active ? AssignmentStatus.OnLoan : AssignmentStatus.Returned,
    returningDate: "2023-06-15 11:50:59",
    active,
  });
};

const createProduct = async (
  active = false,
  areaId = -1,
  categoryId = -1,
  locationId = -1,
) => {
  return Product.create({
    areaId: areaId == -1 ? await createArea() : areaId,
    categoryId: categoryId == -1 ? await createCategory() : categoryId,
    locationId: locationId == -1 ? await createLocation() : locationId,
    name: faker.commerce.product(),
    billName: faker.random.alphaNumeric(5),
    description: faker.commerce.productDescription(),
    stockNumber: faker.random.alphaNumeric(5),
    urlImage: faker.internet.url(),
    urlLink: faker.internet.url(),
    active,
  });
};

export default {
  cleanDataBase,
  closeConnection,
  createContact,
  createUser,
  createSupplier,
  createLocation,
  createCustomer,
  createCategory,
  createArea,
  createAccount,
  createProject,
  createIncome,
  createAssignment,
  createProduct,
};
