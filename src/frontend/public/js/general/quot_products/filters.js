export const filteringQuotProducts = ({
  data,
  isproduct,
  quantity,
  price,
  details,
  wherever,
  active,
}) => {
  if (isproduct)
    data = data.filter((x) =>
      x.product.name
        .toString()
        .toLowerCase()
        .includes(isproduct.toString().toLowerCase()),
    );
  if (quantity)
    data = data.filter((x) =>
      x.quantity
        .toString()
        .toLowerCase()
        .includes(quantity.toString().toLowerCase()),
    );
  if (price)
    data = data.filter(
      (x) =>
        x.price
          .toString()
          .toLowerCase()
          .includes(price.toString().toLowerCase()) ||
        x.totalPrice
          .toString()
          .toLowerCase()
          .includes(price.toString().toLowerCase()),
    );
  if (details)
    data = data.filter((x) =>
      x.details
        .toString()
        .toLowerCase()
        .includes(details.toString().toLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        x.product.name.toLowerCase().includes(wherever.toLowerCase()) ||
        (x.quantity || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.price || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.totalPrice || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        x.details.toLowerCase().includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
