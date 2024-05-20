export const filteringChecks = ({
  data,
  rol,
  name,
  institution,
  type,
  startDate,
  endDate,
  active,
}) => {
  if (rol)
    data = data.filter((check_) =>
      check_.customer.rol.toLowerCase().includes(rol.toLowerCase()),
    );
  if (name)
    data = data.filter((check_) =>
      check_.customer.contact.name.toLowerCase().includes(name.toLowerCase()),
    );
  if (institution)
    data = data.filter((check_) =>
      check_.customer.institution
        .toLowerCase()
        .includes(institution.toLowerCase()),
    );
  if (type)
    data = data.filter((check_) =>
      check_.type.toLowerCase().includes(type.toLowerCase()),
    );
  if (startDate)
    data = data.filter(
      (check_) => new Date(check_.createdAt).addHours(1) >= new Date(startDate),
    );
  if (endDate)
    data = data.filter(
      (check_) => new Date(check_.createdAt).addHours(1) <= new Date(endDate),
    );
  if (active) data = data.filter((check_) => check_.active == active);
  return data;
};
