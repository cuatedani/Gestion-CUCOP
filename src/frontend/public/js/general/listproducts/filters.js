export const filteringListProducts = ({
  data,
  listId,
  productId,
  quantity,
  price,
  active,
}) => {
  if (listId)
    data = data.filter((x) =>
      x.listId
        .toString()
        .toLowerCase()
        .includes(listId.toString().toLowerCase()),
    );
  if (productId)
    data = data.filter((x) =>
      x.productId
        .toString()
        .toLowerCase()
        .includes(productId.toString().toLowerCase()),
    );
  if (quantity)
    data = data.filter((x) =>
      x.quantity
        .toString()
        .toLowerCase()
        .includes(quantity.toString().toLowerCase()),
    );
  if (price)
    data = data.filter((x) =>
      x.price.toString().toLowerCase().includes(price.toString().toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
