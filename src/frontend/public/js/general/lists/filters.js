export const filteringLists = ({ data, listId, status, active }) => {
  if (listId)
    data = data.filter((x) =>
      x.firstNames.toLowerCase().includes(listId.toLowerCase()),
    );
  if (status)
    data = data.filter((x) =>
      x.rol.toLowerCase().includes(status.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
