export const filteringProducts = ({
  data,
  iscucop,
  name,
  description,
  active,
  wherever,
}) => {
  if (iscucop)
    data = data.filter((x) =>
      (x.cucop.descpartidaespecifica + ": " + x.cucop.descripcion)
        .toString()
        .toLowerCase()
        .includes(iscucop.toString().toLowerCase()),
    );
  if (name)
    data = data.filter((x) =>
      x.name.toLowerCase().includes(name.toLowerCase()),
    );
  if (description)
    data = data.filter((x) =>
      x.description.toLowerCase().includes(description.toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        (x.cucop.descpartidaespecifica + ": " + x.cucop.descripcion || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.name || "").toLowerCase().includes(wherever.toLowerCase()) ||
        x.description.toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
