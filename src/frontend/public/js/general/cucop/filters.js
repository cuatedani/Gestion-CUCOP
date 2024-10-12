export const filteringCucop = ({
  data,
  clavecucop,
  descripcion,
  unidaddemedida,
  tipodecontratacion,
  partidaespecifica,
  partidagenerica,
  concepto,
  capitulo,
  wherever,
}) => {
  if (clavecucop)
    data = data.filter((x) => x.clavecucop.toString().includes(clavecucop));
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
    data = data.filter((x) =>
      (x.partidaespecifica.toString() + " - " + x.descpartidaespecifica)
        .toLocaleLowerCase()
        .includes(partidaespecifica.toLocaleLowerCase()),
    );
  if (partidagenerica)
    data = data.filter((x) =>
      (x.partidagenerica.toString() + " - " + x.descpartidagenerica)
        .toLocaleLowerCase()
        .includes(partidagenerica.toLocaleLowerCase()),
    );
  if (concepto)
    data = data.filter(
      (x) =>
        x.concepto.toString() +
        " - " +
        x.descconcepto.includes(concepto.toLocaleLowerCase()),
    );
  if (capitulo)
    data = data.filter(
      (x) =>
        x.capitulo.toString() +
        " - " +
        x.desccapitulo
          .toLocaleLowerCase()
          .includes(concepto.toLocaleLowerCase()),
    );
  if (wherever)
    data = data.filter(
      (x) =>
        x.clavecucop
          .toString()
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.descripcion || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.unidaddemedida || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.tipodecontratacion || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.partidaespecifica.toString() || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.descpartidaespecifica || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.partidagenerica.toString() || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.descpartidagenerica || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.concepto.toString() || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.descconcepto || "").toLowerCase().includes(wherever.toLowerCase()) ||
        (x.capitulo.toString() || "")
          .toLowerCase()
          .includes(wherever.toLowerCase()) ||
        (x.desccapitulo || "").toLowerCase().includes(wherever.toLowerCase()),
    );
  return data;
};
