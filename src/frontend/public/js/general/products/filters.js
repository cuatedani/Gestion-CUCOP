export const filteringProducts = ({
  data,
  cucopId,
  name,
  description,
  active,
}) => {
  if (cucopId)
    data = data.filter((x) =>
      x.cucopId
        .toString()
        .toLowerCase()
        .includes(cucopId.toString().toLowerCase()),
    );
  if (name)
    data = data.filter((x) =>
      x.name.toLowerCase().includes(name.toLowerCase()),
    );
  if (description)
    data = data.filter((x) =>
      x.description.toLowerCase().includes(description.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
