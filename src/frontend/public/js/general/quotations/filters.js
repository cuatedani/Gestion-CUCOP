export const filteringQuotations = ({
  data,
  supplierId,
  price,
  description,
  active,
}) => {
  // Convertir los números a cadenas de texto
  const supplierIdStr = supplierId ? supplierId.toString() : "";
  const priceStr = price ? price.toString() : "";

  // Realizar el filtrado basado en los criterios proporcionados
  return data.filter((x) => {
    const supplierIdMatch =
      !supplierIdStr || x.supplierId.toString().includes(supplierIdStr);
    const priceMatch = !priceStr || x.price.toString().includes(priceStr);
    const descriptionMatch =
      !description ||
      x.description.toLowerCase().includes(description.toLowerCase());
    const activeMatch = active === undefined || x.active == active;

    return supplierIdMatch && priceMatch && descriptionMatch && activeMatch;
  });
};
