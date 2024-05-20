const normalizeText = (str) => str.replace(/\s+/g, "").toLowerCase();

export const filteringCustomers = ({
  data,
  rol,
  name,
  institution,
  address,
  phone,
  email,
  wherever,
  active,
}) => {
  if (rol)
    data = data.filter((customer_) =>
      customer_.rol.toLowerCase().includes(rol.toLowerCase()),
    );
  if (name)
    data = data.filter((customer_) =>
      customer_.contact.name.toLowerCase().includes(name.toLowerCase()),
    );
  if (institution)
    data = data.filter((customer_) =>
      customer_.institution.toLowerCase().includes(institution.toLowerCase()),
    );
  if (address)
    data = data.filter(
      (customer_) =>
        customer_.contact.state.toLowerCase().includes(address.toLowerCase()) ||
        customer_.contact.municipality
          .toLowerCase()
          .includes(address.toLowerCase()) ||
        customer_.contact.suburb
          .toLowerCase()
          .includes(address.toLowerCase()) ||
        customer_.contact.number
          .toLowerCase()
          .includes(address.toLowerCase()) ||
        customer_.contact.cp.toLowerCase().includes(address.toLowerCase()) ||
        customer_.contact.street.toLowerCase().includes(address.toLowerCase()),
    );

  if (phone) {
    phone = normalizeText(phone);
    data = data.filter(
      ({ contact: { phone1, phone2 } }) =>
        normalizeText(phone1).includes(phone) ||
        normalizeText(phone2).includes(phone),
    );
  }

  if (email) {
    email = normalizeText(email);
    data = data.filter(
      ({ contact: { email1, email2 } }) =>
        normalizeText(email1).includes(email) ||
        normalizeText(email2).includes(email),
    );
  }

  if (wherever)
    data = data.filter(
      (x) =>
        (x.contact.name || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.rol || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.institution || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.contact.address || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.contact.phone1 || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.contact.phone2 || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.contact.email1 || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.contact.email2 || "").toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((customer_) => customer_.active == active);
  return data;
};
