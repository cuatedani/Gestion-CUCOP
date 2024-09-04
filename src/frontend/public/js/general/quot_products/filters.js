export const filteringQuotProducts = ({
  data,
  isproduct,
  isbrand,
  ismodel,
  isdenomination,
  isdescription,
  iscucop,
  quantity,
  price,
  discount,
  IVA,
  ISR,
  subtotal,
  amountIVA,
  amountISR,
  totalPrice,
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
  if (isbrand)
    data = data.filter((x) =>
      x.product.brand
        .toString()
        .toLowerCase()
        .includes(isbrand.toString().toLowerCase()),
    );
  if (ismodel)
    data = data.filter((x) =>
      x.product.model
        .toString()
        .toLowerCase()
        .includes(ismodel.toString().toLowerCase()),
    );
  if (isdenomination)
    data = data.filter((x) =>
      x.product.denomination
        .toString()
        .toLowerCase()
        .includes(isdenomination.toString().toLowerCase()),
    );
  if (isdescription)
    data = data.filter((x) =>
      x.product.description
        .toString()
        .toLowerCase()
        .includes(isdescription.toString().toLowerCase()),
    );
  if (iscucop)
    data = data.filter(
      (x) =>
        x.product.cucop.clavecucop +
        " - " +
        x.product.cucop.descripcion
          .toString()
          .toLowerCase()
          .includes(iscucop.toString().toLowerCase()),
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
  if (discount)
    data = data.filter((x) =>
      x.discount
        .toString()
        .toLowerCase()
        .includes(discount.toString().toLowerCase()),
    );
  if (IVA)
    data = data.filter((x) =>
      x.IVA.toString().toLowerCase().includes(IVA.toString().toLowerCase()),
    );
  if (ISR)
    data = data.filter((x) =>
      x.ISR.toString().toLowerCase().includes(ISR.toString().toLowerCase()),
    );
  if (subtotal)
    data = data.filter((x) =>
      x.subtotal
        .toString()
        .toLowerCase()
        .includes(subtotal.toString().toLowerCase()),
    );
  if (amountIVA)
    data = data.filter((x) =>
      x.amountIVA
        .toString()
        .toLowerCase()
        .includes(amountIVA.toString().toLowerCase()),
    );
  if (amountISR)
    data = data.filter((x) =>
      x.amountISR
        .toString()
        .toLowerCase()
        .includes(amountISR.toString().toLowerCase()),
    );
  if (totalPrice)
    data = data.filter((x) =>
      x.totalPrice
        .toString()
        .toLowerCase()
        .includes(totalPrice.toString().toLowerCase()),
    );

  if (wherever)
    data = data.filter(
      (x) =>
        x.product.name.toLowerCase().includes(wherever.toLowerCase()) ||
        x.product.brand.toLowerCase().includes(wherever.toLowerCase()) ||
        x.product.model.toLowerCase().includes(wherever.toLowerCase()) ||
        x.product.denomination.toLowerCase().includes(wherever.toLowerCase()) ||
        x.product.description.toLowerCase().includes(wherever.toLowerCase()) ||
        (x.quantity || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.price || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.IVA || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.ISR || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.discount || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.subtotal || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.amountIVA || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.amountISR || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.totalPrice || "")
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()),
    );
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
