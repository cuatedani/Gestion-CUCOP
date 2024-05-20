import Utils from "../utils";
import Session from "../../../src/backend/models/session";

describe("Session model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should login successfully", async () => {
    await Utils.createUser(true, "email@email.com", "password");
    const token = await Session.login("email@email.com", "password");
    expect(token).not.toBe(undefined);
  });

  it("Should login unsuccessfully", async () => {
    await Utils.createUser(true, "email2@email.com", "password");
    const token = await Session.login("otro@otro.com", "password");
    expect(token).toBe(undefined);
  });

  it("Should verify token", async () => {
    await Utils.createUser(true, "email@email.com", "password");
    const token = await Session.login("email@email.com", "password");
    const verify = await Session.verifyToken(token || "");
    expect(verify).toBe(true);
  });

  it("Should not verify token", async () => {
    const token = await Session.login("otro@email.com", "password");
    const verify = await Session.verifyToken(token || "");
    expect(verify).toBe(false);
  });
});
