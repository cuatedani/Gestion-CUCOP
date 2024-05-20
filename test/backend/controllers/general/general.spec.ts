import app from "../../../../index";
// import request from "supertest";
// import Utils from "../../utils";

describe("General", () => {
  afterAll(() => app.close());

  it("should respond the GET /nosotros", async () => {
    // const { statusCode } = await request(app).get(`/nosotros`);
    // expect(statusCode).toBe(200);
  });
  // it("should respond the GET /contacto", async () => {
  //   const { statusCode } = await request(app).get(`/contacto`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /noticias", async () => {
  //   await Utils.createNew(true);
  //   const { statusCode } = await request(app).get(`/noticias`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /noticias/:id/:title", async () => {
  //   const newId = await Utils.createNew(true);
  //   const { statusCode } = await request(app).get(`/noticias/${newId}/titulo`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /publicaciones", async () => {
  //   await Utils.createPost(true);
  //   const { statusCode } = await request(app).get(`/publicaciones`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /", async () => {
  //   const { statusCode } = await request(app).get(`/`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /productos", async () => {
  //   await Utils.createProduct(true);
  //   const { statusCode } = await request(app).get(`/productos`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /productos/:id/:title", async () => {
  //   const productId = await Utils.createProduct(true);
  //   const { statusCode } = await request(app).get(
  //     `/productos/${productId}/titulo`
  //   );
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /proyectos", async () => {
  //   await Utils.createProject(true);
  //   const { statusCode } = await request(app).get(`/proyectos`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /proyectos/:id/:title", async () => {
  //   const projectId = await Utils.createProject(true);
  //   const { statusCode } = await request(app).get(
  //     `/proyectos/${projectId}/titulo`
  //   );
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /investigadores", async () => {
  //   await Utils.createPersonal(true);
  //   const { statusCode } = await request(app).get(`/investigadores`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /investigadores/:id/:title", async () => {
  //   const personalId = await Utils.createPersonal(true);
  //   const { statusCode } = await request(app).get(
  //     `/investigadores/${personalId}/titulo`
  //   );
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /investigadores/:id/:title", async () => {
  //   const personalId = await Utils.createPersonal(true);
  //   const { statusCode } = await request(app).get(
  //     `/posdoctorantes/${personalId}/titulo`
  //   );
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /investigadores/:id/:title", async () => {
  //   const personalId = await Utils.createPersonal(true);
  //   const { statusCode } = await request(app).get(
  //     `/tecnicos/${personalId}/titulo`
  //   );
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /investigadores", async () => {
  //   const { statusCode } = await request(app).get(`/investigadores`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /estancias", async () => {
  //   const { statusCode } = await request(app).get(`/estancias`);
  //   expect(statusCode).toBe(200);
  // });
  // it("should respond the GET /servicios", async () => {
  //   const { statusCode } = await request(app).get(`/servicios`);
  //   expect(statusCode).toBe(200);
  // });
});
