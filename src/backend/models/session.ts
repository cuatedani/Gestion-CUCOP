import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import config from "../database/config.json";
import db from "../database";
import User, { IUser } from "./user";
import OperationError from "../utils/error";

/*
 * Interfaces
 */

export type IToken = IUser;

/*
 * Methods
 */

const login = async (
  email: string,
  password: string,
): Promise<string | undefined> => {
  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const [rows] = await db.query(
      `
      select
        userId,
        firstNames,
        lastNames,
        email,
        password,
        rol,
        createdAt
      from users
      where
        email=? and
        password=? and
        active=1
    `,
      [email, hashedPassword],
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) throw new OperationError(401, "Unauthorized");
    const dataSession = data[0] as IToken;

    return createToken(dataSession);
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const createToken = (data: IToken): string =>
  jwt.sign(data, config.token, { expiresIn: "1d" });

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const result = decodeToken(token);
    if (!result) throw new OperationError(404, "Token not found");
    const { userId } = result;
    const user = await User.exists(userId);
    if (!user) throw new OperationError(400, "User not found");
    return true;
  } catch (ex) {
    return false;
  }
};

const decodeToken = (token: string): IToken | null => {
  try {
    return jwt.decode(token) as IToken;
  } catch (ex) {
    return null;
  }
};

export default {
  login,
  createToken,
  verifyToken,
  decodeToken,
};
