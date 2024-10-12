export const filteringQuotations = ({
  data,
  quotations,
  supplied,
  description,
  date,
  quotNumber,
  active,
  wherever,
}) => {
  const normalizeDate = (date) => new Date(date).toLocaleDateString("es-ES");
  if (supplied)
    data = quotations.filter((x) =>
      x.supplier.name.toLowerCase().includes(supplied.toLowerCase()),
    );
  if (description)
    data = quotations.filter((x) =>
      x.description.toLowerCase().includes(description.toLowerCase()),
    );

  if (date) {
    const normalizedDate = normalizeDate(date).toLowerCase();
    data = quotations.filter((x) =>
      normalizeDate(x.date).toLowerCase().includes(normalizedDate),
    );
  }
  if (quotNumber)
    data = quotations.filter((x) =>
      x.quotNumber.toLowerCase().includes(quotNumber.toLowerCase()),
    );

  if (wherever)
    data = quotations.filter(
      (x) =>
        x.supplier.name.toLowerCase().includes(wherever.toLowerCase()) ||
        (x.description || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.date || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.quotNumber || "").toLowerCase().includes(wherever.toLowerCase()),
    );

  if (active) data = quotations.filter((x) => x.active == active);

  return data;
};
