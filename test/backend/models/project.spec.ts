import Utils from "../utils";
import Project, { IProject } from "../../../src/backend/models/project";
import { faker } from "@faker-js/faker";

describe("Project model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an project", async () => {
    const projectId = await Utils.createProject(true);
    expect(projectId).not.toBe(-1);
  });

  it("Should check if an project exists", async () => {
    const projectId = await Utils.createProject(true);
    const exist = await Project.exists(projectId);
    expect(exist).toBe(true);
  });

  it("Should check if an project doesn't exists", async () => {
    const exist = await Project.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active projects", async () => {
    await Utils.createProject(true);
    await Utils.createProject(true);
    await Utils.createProject(true);
    await Utils.createProject(false);
    const projects = await Project.getAll({ status: "active" });
    expect(projects).toHaveLength(3);
  });

  it("Should get inactive projects", async () => {
    await Utils.createProject(true);
    await Utils.createProject(true);
    await Utils.createProject(true);
    await Utils.createProject(false);
    const projects = await Project.getAll({ status: "inactive" });
    expect(projects).toHaveLength(1);
  });

  it("Should get all projects sorted asc", async () => {
    const expected = [
      await Utils.createProject(true),
      await Utils.createProject(true),
      await Utils.createProject(true),
      await Utils.createProject(false),
    ].sort((a, b) => a - b);
    const projects = await Project.getAll({
      sort: "asc",
    });
    const obtained = projects.map((u: IProject) => u.projectId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all projects sorted desc, limited and inactive", async () => {
    await Utils.createProject(true);
    await Utils.createProject(true);
    await Utils.createProject(true);
    const expected = [await Utils.createProject(false)].sort((a, b) => b - a);
    const projects = await Project.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = projects.map((u: IProject) => u.projectId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an project by id", async () => {
    const projectId = await Utils.createProject(true);
    const project = await Project.getById(projectId);
    expect(project).not.toBe(undefined);
  });

  it("Should not get an project because it's id doesn't exist", async () => {
    const project = await Project.getById(-1);
    expect(project).toBe(undefined);
  });

  it("Should update an project", async () => {
    const customerId = await Utils.createCustomer(true);
    const projectId = await Utils.createProject(true);
    const update = await Project.update(projectId, {
      customerId,
      name: faker.random.word(),
      description: faker.random.words(10),
      active: false,
    });
    expect(update).toBe(true);
  });

  it("Should not update an project", async () => {
    const update = await Project.update(-1, {
      customerId: 4,
      name: faker.random.word(),
      description: faker.random.words(10),
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an project", async () => {
    const projectId = await Utils.createProject(true);
    const remove = await Project.remove(projectId);
    expect(remove).toBe(true);
  });

  it("Should not remove an project", async () => {
    const remove = await Project.remove(1);
    expect(remove).toBe(false);
  });
});
