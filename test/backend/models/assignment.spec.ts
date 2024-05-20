import Utils from "../utils";
import Assignment, {
  IAssignment,
  AssignmentStatus,
} from "../../../src/backend/models/assignment";
import { faker } from "@faker-js/faker";

describe("Assignment model", () => {
  beforeEach(async () => await Utils.cleanDataBase(), 10000);
  afterAll(async () => await Utils.closeConnection());

  it("Should create an assignment", async () => {
    const assignmentId = await Utils.createAssignment(true);
    expect(assignmentId).not.toBe(-1);
  });

  it("Should check if an assignment exists", async () => {
    const assignmentId = await Utils.createAssignment(true);
    const exist = await Assignment.exists(assignmentId);
    expect(exist).toBe(true);
  });

  it("Should check if an assignment doesn't exists", async () => {
    const exist = await Assignment.exists(10);
    expect(exist).toBe(false);
  });

  it("Should get active assignments", async () => {
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    await Utils.createAssignment(false);
    const assignments = await Assignment.getAll({ status: "active" });
    expect(assignments).toHaveLength(3);
  });

  it("Should get inactive assignments", async () => {
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    await Utils.createAssignment(false);
    const assignments = await Assignment.getAll({ status: "inactive" });
    expect(assignments).toHaveLength(1);
  });

  it("Should get all assignments sorted asc", async () => {
    const expected = [
      await Utils.createAssignment(true),
      await Utils.createAssignment(true),
      await Utils.createAssignment(true),
      await Utils.createAssignment(false),
    ].sort((a, b) => a - b);
    const assignments = await Assignment.getAll({
      sort: "asc",
    });
    const obtained = assignments.map((u: IAssignment) => u.assignmentId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get all assignments sorted desc, limited and inactive", async () => {
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    await Utils.createAssignment(true);
    const expected = [await Utils.createAssignment(false)].sort(
      (a, b) => b - a
    );
    const assignments = await Assignment.getAll({
      sort: "desc",
      limit: 1,
      status: "inactive",
    });
    const obtained = assignments.map((u: IAssignment) => u.assignmentId);
    expect(obtained).toStrictEqual(expected);
  });

  it("Should get an assignment by id", async () => {
    const assignmentId = await Utils.createAssignment(true);
    const assignment = await Assignment.getById(assignmentId);
    expect(assignment).not.toBe(undefined);
  });

  it("Should not get an assignment because it's id doesn't exist", async () => {
    const assignment = await Assignment.getById(-1);
    expect(assignment).toBe(undefined);
  });

  it("Should update an assignment", async () => {
    const customerId = await Utils.createCustomer(true);
    const assignmentId = await Utils.createAssignment(true);
    const update = await Assignment.update(assignmentId, {
      customerId,
      comments: faker.lorem.sentence(5),
      status: AssignmentStatus.Returned,
      returningDate: "2023-06-15 11:50:59",
      active: true,
    });
    expect(update).toBe(true);
  });

  it("Should not update an assignment", async () => {
    const update = await Assignment.update(-1, {
      customerId: 5,
      comments: faker.lorem.sentence(5),
      status: AssignmentStatus.Returned,
      returningDate: "2023-06-15 11:50:59",
      active: true,
    });
    expect(update).toBe(false);
  });

  it("Should remove an assignment", async () => {
    const assignmentId = await Utils.createAssignment(true);
    const remove = await Assignment.remove(assignmentId);
    expect(remove).toBe(true);
  });

  it("Should not remove an assignment", async () => {
    const remove = await Assignment.remove(1);
    expect(remove).toBe(false);
  });
});
