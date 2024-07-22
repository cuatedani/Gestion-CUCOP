export const filteringLists = ({
  data,
  owner,
  title,
  description,
  status,
  active,
  wherever,
}) => {
  if (owner)
    data = data.filter((x) =>
      (x.user.firstNames + " " + x.user.lastNames)
        .toString()
        .toLowerCase()
        .includes(owner.toString().toLowerCase()),
    );
  if (title)
    data = data.filter((x) =>
      x.title.toLowerCase().includes(title.toLowerCase()),
    );
  if (description)
    data = data.filter((x) =>
      x.description.toLowerCase().includes(description.toLowerCase()),
    );
  if (status)
    data = data.filter((x) =>
      x.status.toLowerCase().includes(status.toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        (x.user.firstNames || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.user.lastNames || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.user.firstNames + " " + x.user.lastNames)
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.title || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.status || "").toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
