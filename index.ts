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

//  C O N T R O L L E R S
//Vistas
import principalController from "./src/backend/controllers/general/principal";
import sessionController from "./src/backend/controllers/general/session";
import usersController from "./src/backend/controllers/general/users";
import suppliersController from "./src/backend/controllers/general/suppliers";
import cucopController from "./src/backend/controllers/general/cucop";
import listsController from "./src/backend/controllers/general/lists";
import quotationsController from "./src/backend/controllers/general/quotations";
import productsController from "./src/backend/controllers/general/products";
import listproductsController from "./src/backend/controllers/general/list_products";

//Apis
import sessionApiController from "./src/backend/controllers/api/session";
import usersApiController from "./src/backend/controllers/api/users";
import listsApiController from "./src/backend/controllers/api/lists";
import cucopApiController from "./src/backend/controllers/api/cucop";
import productsApiController from "./src/backend/controllers/api/products";
import listproductsApiController from "./src/backend/controllers/api/list_products";
import suppliersApiController from "./src/backend/controllers/api/suppliers";
import quotationsApiController from "./src/backend/controllers/api/quotations";

//Error
import commonController from "./src/backend/controllers/common/common";

const app = express();
const PORT = process.env.NODE_PORT || 3005;

// Configuration
app.use(
  "/cucop/public",
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
app.use(suppliersController);
app.use(cucopController);
app.use(listsController);
app.use(quotationsController);
app.use(productsController);
app.use(listproductsController);
app.use(sessionController);

app.use(sessionApiController);
app.use(usersApiController);
app.use(suppliersApiController);
app.use(cucopApiController);
app.use(listsApiController);
app.use(quotationsApiController);
app.use(productsApiController);
app.use(listproductsApiController);

app.use(commonController);

export default app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
