/* eslint-disable no-undef */
import { filteringQuotProducts } from "/cucop/public/js/general/quot_products/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      mid: "",
      quotationId: "",
      productId: "",
      quantity: "",
      price: "",
      totalPrice: "",
      details: "",
      active: "1",
      quotation: {
        quotationId: "",
        description: "",
        quotNumber: "",
        date: "",
        active: 0,
        createdAt: "",
        supplier: {
          name: "",
          description: "",
          tin: "",
          phone: "",
          address: "",
          email: "",
        },
      },
      product: {
        name: "",
      },
      wherever: "",
      isproduct: "",
      quotProducts: [],
      mediadata: [],
      data: [],
      showTableInfo: true,
      showExtraFilters: false,
    };
  },
  mounted() {
    const href = window.location.href;
    const qid = href.split("/")[7];
    try {
      this.quotationId = parseInt(qid);
    } catch (ex) {
      this.quotationId = 0;
    }
    this.loadQuotation();
    this.loadQuotProducts();
    this.loadMedias();
  },
  computed: {
    AttachedFiles() {
      return this.mediadata;
    },
    filteredQuotProducts() {
      return filteringQuotProducts(this).map((quotpro) => ({
        ...quotpro,
        quantity: this.highlight(
          quotpro.quantity,
          this.quantity || this.wherever,
        ),
        price: this.highlight(quotpro.price, this.price || this.wherever),
        totalPrice: this.highlight(
          quotpro.totalPrice,
          this.totalPrice || this.wherever,
        ),
        details: this.highlight(quotpro.details, this.details || this.wherever),
        product: {
          ...quotpro.product,
          name: this.highlight(
            quotpro.product.name,
            this.isproduct || this.wherever,
          ),
        },
      }));
    },
    tableInfoButtonText() {
      return this.showTableInfo ? "Ocultar Información" : "Mostrar Información";
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
    },
  },
  methods: {
    loadQuotProducts: async function () {
      try {
        const request = await axios.get(
          "/cucop/api/quotations/quot-products/" + this.quotationId,
        );
        this.data = request.data.quotproducts;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    loadQuotation: async function () {
      try {
        const request = await axios.get(
          "/cucop/api/Quotations/" + this.quotationId,
        );
        this.quotation = request.data.quotation;
      } catch (ex) {
        console.log(ex);
        this.quotation = {};
      }
    },
    loadMedias: async function () {
      try {
        const request = await axios.get(
          "/cucop/api/medias/quotations/" + this.quotationId,
        );
        this.mediadata = request.data.medias;
      } catch (ex) {
        console.log(ex);
        this.mediadata = {};
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.quotProductId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este producto?</p>
      <p><b>${data.product.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
      this.ismedia = false;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/quot-products/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadQuotProducts();
      } catch (ex) {
        console.log(ex);
      }
    },
    getIsmedia() {
      return this.ismedia;
    },
    showDialogFile: function (id) {
      const data = this.mediadata.find((tmp) => tmp.mediaId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este archivo?</p>
      <p><b>${data.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.mid = id;
      this.ismedia = true;
    },
    deleteFile: async function () {
      try {
        await axios.delete(`/cucop/api/medias/${this.mid}`);
        $("#modalDelete").modal("toggle");
        this.loadMedias();
      } catch (ex) {
        console.log(ex);
      }
    },
    toggleTableInfo() {
      this.showTableInfo = !this.showTableInfo;
    },
    toggleExtraFilters() {
      this.showExtraFilters = !this.showExtraFilters;
    },
    highlight(text, search) {
      if (!search) return text;
      return text
        .toString()
        .replace(new RegExp(search, "gi"), (match) => `<mark>${match}</mark>`);
    },
    exportData() {
      // Crea un libro de trabajo de XLSX
      const workbook = XLSX.utils.book_new();

      // Filtra y transforma los datos para la exportación
      const modifiedData = this.data
        .filter((item) => item.active)
        .map((item) => ({
          Producto: item.product.name,
          Cantidad: item.quantity,
          PrecioUnitario: item.price,
          PrecioTotal: item.price,
          Detalles: item.details,
        }));

      // Convierte los datos modificados a una hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(modifiedData);

      // Añade la hoja de cálculo al libro de trabajo
      XLSX.utils.book_append_sheet(workbook, worksheet, "ProductosCotizados");

      // Exporta el libro de trabajo a un archivo .xlsx
      XLSX.writeFile(workbook, "ProductosCotizados.xlsx");
    },
    downloadQuotation() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Formateador para precios en moneda local (MXN en este ejemplo)
      const currencyFormatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      });

      // Formateador para fechas
      const dateFormatter = new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Cargar la imagen del banner
      const bannerImage = new Image();
      bannerImage.src = "/cucop/public/images/pdf/banner.png";

      bannerImage.onload = () => {
        // Insertar la imagen en el PDF
        doc.addImage(bannerImage, "PNG", 10, 10, 190, 20);

        let i = 36; // Ajusta la posición vertical después de la imagen

        doc.setFontSize(10);
        // Información de la cotización
        doc.setFont("helvetica", "bold");
        doc.text(`Número de cotización: `, 24, i);
        doc.text(`${this.quotation.quotNumber}`, 63, i);

        i += 2;
        doc.text(`Fecha:`, 130, i);
        doc.text(
          `${dateFormatter.format(new Date(this.quotation.date))}`,
          142,
          i,
        );

        i += 2;
        doc.setFont("helvetica", "normal");
        doc.text(`${this.quotation.description}`, 24, i);

        i += 3;
        doc.setLineWidth(0.05);
        doc.line(10, i, 200, i);

        i += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bolditalic");
        doc.text(`Información del Proveedor`, 70, i);

        i += 5;
        //doc.text(`${this.quotation.supplier.description}`, 55, i);

        // Información del proveedor
        i += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");

        // Definir anchos máximos y posiciones de inicio para cada columna
        const columnWidths = {
          rfc: 20,
          name: 25,
          address: 55,
          phone: 20,
          email: 30,
        };

        const columnStartPositions = {
          rfc: 20,
          name: 45,
          address: 70,
          phone: 125,
          email: 155,
        };

        // Centrar las cabeceras
        doc.text(
          "RFC",
          columnStartPositions.rfc +
            columnWidths.rfc / 2 -
            doc.getTextWidth("RFC") / 2,
          i,
        );
        doc.text(
          "Nombre",
          columnStartPositions.name +
            columnWidths.name / 2 -
            doc.getTextWidth("Nombre") / 2,
          i,
        );
        doc.text(
          "Dirección",
          columnStartPositions.address +
            columnWidths.address / 2 -
            doc.getTextWidth("Dirección") / 2,
          i,
        );
        doc.text(
          "Teléfono",
          columnStartPositions.phone +
            columnWidths.phone / 2 -
            doc.getTextWidth("Teléfono") / 2,
          i,
        );
        doc.text(
          "Correo",
          columnStartPositions.email +
            columnWidths.email / 2 -
            doc.getTextWidth("Correo") / 2,
          i,
        );

        i += 6;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        // Añadir los valores ajustados para que el texto salte de línea si es demasiado largo
        doc.text(
          doc.splitTextToSize(
            `${this.quotation.supplier.tin}`,
            columnWidths.rfc,
          ),
          columnStartPositions.rfc,
          i,
        );
        doc.text(
          doc.splitTextToSize(
            `${this.quotation.supplier.name}`,
            columnWidths.name,
          ),
          columnStartPositions.name,
          i,
        );
        doc.text(
          doc.splitTextToSize(
            `${this.quotation.supplier.address}`,
            columnWidths.address,
          ),
          columnStartPositions.address,
          i,
        );
        doc.text(
          doc.splitTextToSize(
            `${this.quotation.supplier.phone}`,
            columnWidths.phone,
          ),
          columnStartPositions.phone,
          i,
        );
        doc.text(
          doc.splitTextToSize(
            `${this.quotation.supplier.email}`,
            columnWidths.email + 5,
          ),
          columnStartPositions.email,
          i,
        );

        i += 8;
        doc.setLineWidth(0.05);
        doc.line(10, i, 200, i);

        i += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bolditalic");
        doc.text(`Artículos`, 90, i);
        // Configuración de la tabla
        const headers = [
          "Producto",
          "Cantidad",
          "Precio Unitario",
          "Precio Total",
          "Detalles",
        ];

        const modifiedData = this.data
          .filter((item) => item.active)
          .map((item) => ({
            Producto: item.product.name,
            Cantidad: item.quantity,
            PrecioUnitario: currencyFormatter.format(item.price), // Formato de moneda
            PrecioTotal: currencyFormatter.format(item.price * item.quantity), // Formato de moneda y multiplicación por cantidad
            Detalles: item.details,
          }));

        const rows = modifiedData.map((item) => [
          item.Producto,
          item.Cantidad,
          item.PrecioUnitario,
          item.PrecioTotal,
          item.Detalles,
        ]);

        // Añade la tabla al documento
        i += 5;
        doc.autoTable({
          startY: i,
          head: [headers],
          body: rows,
          theme: "grid",
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0], // Texto en color negro
          },
          headStyles: {
            fillColor: [255, 255, 255], // Fondo blanco para las filas impares
            textColor: [0, 0, 0], // Texto negro para las filas
            lineWidth: 0, // Grosor de las líneas
            lineColor: [255, 255, 255], // Color gris oscuro para las líneas verticales
          },
          bodyStyles: {
            fillColor: [255, 255, 255], // Fondo blanco para las filas impares
            textColor: [0, 0, 0], // Texto negro para las filas
            lineWidth: 0.3, // Grosor de las líneas
            lineColor: [180, 180, 180], // Color gris oscuro para las líneas verticales
          },
          alternateRowStyles: {
            fillColor: [235, 235, 235], // Fondo gris claro con opacidad para las filas pares
            lineWidth: 0.3, // Grosor de las líneas
            lineColor: [180, 180, 180], // Color gris oscuro para las líneas verticales
          },
          margin: {
            right: 10,
            left: 10,
          },
          tableLineColor: [180, 180, 180], // Líneas de los bordes exteriores de la tabla en gris oscuro
          tableLineWidth: 0.3, // Grosor de las líneas de los bordes exteriores
          // Permitir que la tabla continúe en una nueva página si es necesario
          pageBreak: "auto",
          showHead: "everyPage", // Mostrar la cabecera en cada página
        });

        // Guarda el documento como PDF
        doc.save("Cotización.pdf");
      };
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  if (app.getIsmedia()) {
    app.deleteFile();
  } else {
    app.delete();
  }
});
