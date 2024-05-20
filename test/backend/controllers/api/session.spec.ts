import app from "../../../../index";
import request from "supertest";
import Utils from "../../utils";

describe("Session", () => {
  beforeEach(async () => await Utils.cleanDataBase());
  afterAll(() => app.close());

  it("should respond the POST route /time/api/session", async () => {
    const data = { email: "email@email.com", password: "qwerty" };
    await Utils.createUser(true, data.email, data.password);
    const { text } = await request(app).post(`/time/api/session`).send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(200);
  });

  it("shouldn't respond the POST route /time/api/session", async () => {
    const data = { email: "correo@correo.com", password: "asdfgh" };
    const { text } = await request(app).post(`/time/api/session`).send(data);
    const res = JSON.parse(text);
    expect(res.code).toBe(401);
  });
});
