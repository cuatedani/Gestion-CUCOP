import express from "express";
import session from "express-session";
import path from "path";
import cors from "cors";

import { IUser } from "./src/backend/models/user";

declare module "express-session" {
  interface SessionData {
    token: string;
    user: IUser;
  }
}

// Controllers
import principalController from "./src/backend/controllers/general/principal";
import usersController from "./src/backend/controllers/general/users";
import sessionController from "./src/backend/controllers/general/session";
import customersController from "./src/backend/controllers/general/customers";
import checksController from "./src/backend/controllers/general/checks";
import reportsController from "./src/backend/controllers/general/reports";

import usersApiController from "./src/backend/controllers/api/users";
import contactsApiController from "./src/backend/controllers/api/contacts";
import customersApiController from "./src/backend/controllers/api/customers";
import checksApiController from "./src/backend/controllers/api/checks";
import reportsApiController from "./src/backend/controllers/api/reports";
import sessionApiController from "./src/backend/controllers/api/session";

import commonController from "./src/backend/controllers/common/common";

const app = express();
const PORT = process.env.NODE_PORT || 3005;

// Configuration
app.use(
  "/time/public",
  express.static(path.join(__dirname, "./src/frontend/public")),
);
app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "CICESE-UT3",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(cors());

app.use(principalController);
app.use(usersController);
app.use(sessionController);
app.use(customersController);
app.use(checksController);
app.use(reportsController);

app.use(usersApiController);
app.use(contactsApiController);
app.use(customersApiController);
app.use(checksApiController);
app.use(reportsApiController);
app.use(sessionApiController);
app.use(commonController);

export default app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
