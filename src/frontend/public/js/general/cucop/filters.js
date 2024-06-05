export const filteringCucop = ({
  data,
  clavecucopid,
  clavecucop,
  descripcion,
  unidaddemedida,
  tipodecontratacion,
  partidaespecifica,
  descpartidaespecifica,
  partidagenerica,
  descpartidagenerica,
  concepto,
  descconcepto,
  capitulo,
  desccapitulo,
  fechaalta,
  fechamodificacion,
  active,
}) => {
  if (clavecucopid)
    data = data.filter((x) => x.clavecucopid.includes(clavecucopid));
  if (clavecucop) data = data.filter((x) => x.clavecucop.includes(clavecucop));
  if (descripcion)
    data = data.filter((x) =>
      x.descripcion.toLowerCase().includes(descripcion.toLowerCase()),
    );
  if (unidaddemedida)
    data = data.filter((x) =>
      x.unidaddemedida.toLowerCase().includes(unidaddemedida.toLowerCase()),
    );
  if (tipodecontratacion)
    data = data.filter((x) =>
      x.tipodecontratacion
        .toLowerCase()
        .includes(tipodecontratacion.toLowerCase()),
    );
  if (partidaespecifica)
    data = data.filter((x) => x.partidaespecifica.includes(partidaespecifica));
  if (descpartidaespecifica)
    data = data.filter((x) =>
      x.descpartidaespecifica
        .toLowerCase()
        .includes(descpartidaespecifica.toLowerCase()),
    );
  if (partidagenerica)
    data = data.filter((x) => x.partidagenerica.includes(partidagenerica));
  if (descpartidagenerica)
    data = data.filter((x) =>
      x.descpartidagenerica
        .toLowerCase()
        .includes(descpartidagenerica.toLowerCase()),
    );
  if (concepto) data = data.filter((x) => x.concepto.includes(concepto));
  if (descconcepto)
    data = data.filter((x) =>
      x.descconcepto.toLowerCase().includes(descconcepto.toLowerCase()),
    );
  if (capitulo) data = data.filter((x) => x.capitulo.includes(capitulo));
  if (desccapitulo)
    data = data.filter((x) =>
      x.desccapitulo.toLowerCase().includes(desccapitulo.toLowerCase()),
    );
  if (fechaalta) data = data.filter((x) => x.fechaalta.includes(fechaalta));
  if (fechamodificacion)
    data = data.filter((x) => x.fechamodificacion.includes(fechamodificacion));
  if (active) data = data.filter((x) => x.active == active);
  return data;
};
