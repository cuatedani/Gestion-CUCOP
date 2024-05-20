import express from "express";
import Customer, { ICustomerRol } from "../../models/customer";
import auth from "../../middlewares/auth";
import Contact from "../../models/contact";

const app = express();

app.get("/time/api/customers", auth, async (req, res) => {
  const {
    sort = "desc",
    customerId,
    rol,
    institution,
    name,
    status = "all",
  } = req.query;

  const customers = await Customer.getAll({
    sort: sort as "desc" | "asc",
    customerId: customerId as number | undefined,
    rol: rol as ICustomerRol,
    institution: institution as string,
    name: name as string,
    status: status as "all" | "active" | "inactive",
  });

  res.status(200).send({ customers });
});

app.get("/time/api/customers/:id", auth, async (req, res) => {
  const customer = await Customer.getById(req.params.id);
  res.status(200).send({ customer });
});

app.post("/time/api/customers", auth, async (req, res) => {
  const { contact, ...data } = req.body;
  const contactId = await Contact.create(contact);
  const id = await Customer.create({
    contactId,
    ...data,
  });
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/time/api/customers/:id", auth, async (req, res) => {
  const updated = await Customer.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({});
});

app.delete("/time/api/customers/:id", auth, async (req, res) => {
  const updated = await Customer.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({});
});

export default app;
