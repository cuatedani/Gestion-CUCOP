import app from "../../../../index";
import request from "supertest";

describe("Common", () => {
  afterAll(() => app.close());

  it("should respond the GET for invalid route", async () => {
    const { statusCode } = await request(app).get(`/route-does-not-exists`);
    expect(statusCode).toBe(200);
  });
});
