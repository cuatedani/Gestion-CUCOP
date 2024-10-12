export const filteringProducts = ({
  data,
  iscucop,
  name,
  description,
  brand,
  model,
  denomination,
  serialNumber,
  itemNumber,
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

  if (brand)
    data = data.filter((x) =>
      x.brand.toLowerCase().includes(brand.toLowerCase()),
    );

  if (model)
    data = data.filter((x) =>
      x.model.toLowerCase().includes(model.toLowerCase()),
    );

  if (denomination)
    data = data.filter((x) =>
      x.denomination.toLowerCase().includes(denomination.toLowerCase()),
    );

  if (serialNumber)
    data = data.filter((x) =>
      x.serialNumber.toLowerCase().includes(serialNumber.toLowerCase()),
    );

  if (itemNumber)
    data = data.filter((x) =>
      x.itemNumber.toLowerCase().includes(itemNumber.toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        (x.cucop.clavecucop + " - " + x.cucop.descripcion || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.name || "").toLowerCase().includes(wherever.toLowerCase()) ||
        x.description.toLowerCase().includes(wherever.toLowerCase()) ||
        x.brand.toLowerCase().includes(wherever.toLowerCase()) ||
        x.model.toLowerCase().includes(wherever.toLowerCase()) ||
        x.denomination.toLowerCase().includes(wherever.toLowerCase()) ||
        x.serialNumber.toLowerCase().includes(wherever.toLowerCase()) ||
        x.itemNumber.toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
