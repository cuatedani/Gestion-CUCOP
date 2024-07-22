export const filteringSuppliers = ({
  data,
  name,
  description,
  tin,
  phone,
  address,
  email,
  active,
  wherever,
}) => {
  if (name)
    data = data.filter((x) =>
      x.name.toLowerCase().includes(name.toLowerCase()),
    );
  if (description)
    data = data.filter((x) =>
      x.description.toLowerCase().includes(description.toLowerCase()),
    );
  if (tin)
    data = data.filter((x) => x.tin.toLowerCase().includes(tin.toLowerCase()));
  if (phone)
    data = data.filter((x) =>
      x.phone.toLowerCase().includes(phone.toLowerCase()),
    );
  if (address)
    data = data.filter((x) =>
      x.address.toLowerCase().includes(address.toLowerCase()),
    );
  if (email)
    data = data.filter((x) =>
      x.email.toLowerCase().includes(email.toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        x.name.toLowerCase().includes(wherever.toLowerCase()) ||
        (x.description || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.tin || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.phone || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.address || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.email || "").toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
