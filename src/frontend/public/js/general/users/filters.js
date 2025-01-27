export const filteringUsers = ({
  data,
  firstNames,
  lastNames,
  rol,
  email,
  active,
  wherever,
}) => {
  if (firstNames)
    data = data.filter((x) =>
      x.firstNames.toLowerCase().includes(firstNames.toLowerCase()),
    );
  if (lastNames)
    data = data.filter((x) =>
      x.lastNames.toLowerCase().includes(lastNames.toLowerCase()),
    );
  if (rol)
    data = data.filter((x) => x.rol.toLowerCase().includes(rol.toLowerCase()));
  if (email)
    data = data.filter((x) =>
      x.email.toLowerCase().includes(email.toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        x.firstNames.toLowerCase().includes(wherever.toLowerCase()) ||
        (x.lastNames || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.email || "").toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
