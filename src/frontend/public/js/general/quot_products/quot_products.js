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
      discount: "",
      IVA: "",
      ISR: "",
      subtotal: "",
      amountIVA: "",
      amountISR: "",
      totalPrice: "",
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
        brand: "",
        model: "",
        denomination: "",
        description: "",
        cucop: { clavecucop: "", descripcion: "" },
      },
      wherever: "",
      isproduct: "",
      isbrand: "",
      ismodel: "",
      isdenomination: "",
      isdescription: "",
      iscucop: "",
      mediadata: [],
      data: [],
      showTableInfo: true,
      showExtraFilters: false,
      code: 0,
      isLoading: false,
      processButtonText: "Cargar",
      errorMessage: "",
      successMessage: "",
      file: null,
    };
  },
  async mounted() {
    const href = window.location.href;
    const qid = href.split("/")[7];
    try {
      this.quotationId = parseInt(qid);
    } catch (ex) {
      this.quotationId = 0;
    }
    await this.loadQuotation();
    await this.loadQuotProducts();
    await this.loadMedias();
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
        discount: this.highlight(
          quotpro.discount,
          this.discount || this.wherever,
        ),
        IVA: this.highlight(quotpro.IVA, this.IVA || this.wherever),
        ISR: this.highlight(quotpro.ISR, this.ISR || this.wherever),
        subtotal: this.highlight(
          quotpro.subtotal,
          this.subtotal || this.wherever,
        ),
        amountIVA: this.highlight(
          quotpro.amountIVA,
          this.amountIVA || this.wherever,
        ),
        amountISR: this.highlight(
          quotpro.amountISR,
          this.amountISR || this.wherever,
        ),
        totalPrice: this.highlight(
          quotpro.totalPrice,
          this.totalPrice || this.wherever,
        ),
        product: {
          ...quotpro.product,
          name: this.highlight(
            quotpro.product.name,
            this.isproduct || this.wherever,
          ),
          brand: this.highlight(
            quotpro.product.brand,
            this.isbrand || this.wherever,
          ),
          model: this.highlight(
            quotpro.product.model,
            this.ismodel || this.wherever,
          ),
          denomination: this.highlight(
            quotpro.product.denomination,
            this.isdenomination || this.wherever,
          ),
          description: this.highlight(
            quotpro.product.description,
            this.isdescription || this.wherever,
          ),
          cucop: {
            ...quotpro.product.cucop,
            clavecucop: this.highlight(
              quotpro.product.cucop.clavecucop +
                " - " +
                quotpro.product.cucop.descripcion,
              this.iscucop || this.wherever,
            ),
            descripcion: this.highlight(
              quotpro.product.cucop.clavecucop +
                " - " +
                quotpro.product.cucop.descripcion,
              this.iscucop || this.wherever,
            ),
          },
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
        const request = await axios.get("/cucop/api/quotationProducts/", {
          params: {
            quotationId: this.quotation.quotationId,
          },
        });
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
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/quotationProducts/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadQuotProducts();
      } catch (ex) {
        console.log(ex);
      }
    },
    showDialogFile: function (id) {
      const data = this.mediadata.find((tmp) => tmp.mediaId == id);
      $("#modalDeleteFileBody").html(`
      <p>¿Estás seguro de eliminar este archivo?</p>
      <p><b>${data.name}</b></p>
      `);
      $("#modalDeleteFile").modal("toggle");
      this.mid = id;
    },
    deleteFile: async function () {
      try {
        await axios.delete(`/cucop/api/medias/${this.mid}`);
        $("#modalDeleteFile").modal("toggle");
        this.loadMedias();
      } catch (ex) {
        console.log(ex);
      }
    },
    showDialogLoad: function () {
      $("#modalUpload").modal("toggle");
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
          CUCoP: item.product.cucop.clavecucop,
          Producto: item.product.name,
          Marca: item.product.brand,
          Modelo: item.product.model,
          Unidad: item.product.denomination,
          Descripción: item.product.description,
          PrecioUnitario: item.price,
          Cantidad: item.quantity,
          Descuento: item.discount,
          SubTotal: item.subtotal,
          IVA: item.IVA,
          MontoIVA: item.amountIVA,
          ISR: item.ISR,
          MontoISR: item.amountISR,
          PrecioTotal: item.totalPrice,
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
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

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

        doc.addPage("a4", "landscape");

        // Configuración de la tabla
        const headers = [
          "CUCoP",
          "Producto",
          "Marca",
          "Modelo",
          "Unidad",
          "Descripción",
          "Cantidad",
          "Precio Unitario",
          "Descuento",
          "SubTotal",
          "IVA",
          "MontoIVA",
          "ISR",
          "MontoISR",
          "Precio Total",
        ];

        const modifiedData = this.data
          .filter((item) => item.active)
          .map((item) => ({
            CUCoP:
              item.product.cucop.clavecucop +
              " - " +
              item.product.cucop.descripcion,
            Producto: item.product.name,
            Marca: item.product.brand,
            Modelo: item.product.model,
            Unidad: item.product.denomination,
            Descripción: item.product.description,
            PrecioUnitario: currencyFormatter.format(item.price),
            Cantidad: item.quantity,
            Descuento: item.discount,
            SubTotal: currencyFormatter.format(item.subtotal),
            IVA: item.IVA,
            MontoIVA: currencyFormatter.format(item.amountIVA),
            ISR: item.ISR,
            MontoISR: currencyFormatter.format(item.amountISR),
            PrecioTotal: currencyFormatter.format(item.totalPrice),
          }));

        const rows = modifiedData.map((item) => [
          item.CUCoP,
          item.Producto,
          item.Marca,
          item.Modelo,
          item.Unidad,
          item.Descripción,
          item.Cantidad,
          item.PrecioUnitario,
          item.Descuento,
          item.SubTotal,
          item.IVA,
          item.MontoIVA,
          item.ISR,
          item.MontoISR,
          item.PrecioTotal,
        ]);

        // Añade la tabla al documento
        doc.autoTable({
          startY: 25,
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
          columnStyles: {
            0: { cellWidth: 25 }, // CUCoP
            1: { cellWidth: 25 }, // Producto
            2: { cellWidth: 20 }, // Marca
            3: { cellWidth: 20 }, // Modelo
            4: { cellWidth: 15 }, // Unidad
            5: { cellWidth: 35 }, // Descripción
            // Ajustar ancho de otras columnas según sea necesario
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
    handleFileUpload(event) {
      this.code = 0;
      const files = event.target.files;
      if (files.length > 0) {
        this.file = files;
        this.fileUrl = Array.from(files).map((file) =>
          URL.createObjectURL(file),
        );
      }
    },
    processFile() {
      if (!this.file || this.file.length === 0) {
        this.code = 404;
        this.errorMessage =
          "Por favor, sube al menos un archivo antes de cargarlo.";
        return;
      }
      this.sendFile();
    },
    async sendFile() {
      try {
        this.isLoading = true;
        const formData = new FormData();

        Array.from(this.file).forEach((file) => {
          formData.append("media", file);
        });

        const result = await fetch(
          `/cucop/api/medias/quotations/${this.quotationId}/`,
          {
            method: "POST",
            body: formData,
          },
        );

        this.code = result.status;
        if (this.code === 200) {
          this.isLoading = false;
          this.successMessage = "Archivos cargados exitosamente";
          setTimeout(() => {
            this.loadMedias();
            $("#modalUpload").modal("toggle");
          }, 1500);
        } else {
          throw new Error("Error en la carga de archivos");
        }
      } catch (ex) {
        this.isLoading = false;
        this.code = 500;
        this.errorMessage = ex.message;
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});

$("#btnDeleteFile").click(() => {
  app.deleteFile();
});
