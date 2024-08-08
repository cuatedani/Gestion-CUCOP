/* eslint-disable no-undef */
import { filteringQuotProducts } from "/cucop/public/js/general/quot_products/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
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
      data: [],
      showTableInfo: false,
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
  },
  computed: {
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
        await axios.delete(`/cucop/api/quot-products/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadQuotProducts();
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

      let i = 30;

      doc.setFontSize(12);
      // Información de la cotización
      doc.setFont("helvetica", "bold");
      doc.text(`Número de cotización:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.quotNumber}`, 60, i);
      doc.setFont("helvetica", "bold");
      doc.text(`Fecha:`, 100, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.date}`, 115, i);
      i += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Detalles:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.description}`, 32, i);

      // Información del proveedor
      doc.setFontSize(14);
      i += 10;
      doc.setFont("helvetica", "bold");
      doc.text(`${this.quotation.supplier.name}`, 14, i);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      i += 6;
      doc.setFont("helvetica", "bold");
      doc.text(`RFC:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.supplier.tin}`, 25, i);
      i += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Descripción:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.supplier.description}`, 40, i);

      doc.setFontSize(14);
      i += 8;
      doc.setFont("helvetica", "bold");
      doc.text(`Contacto`, 14, i);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      i += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Telefóno:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.supplier.phone}`, 34, i);
      i += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Dirección:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.supplier.address}`, 36, i);
      i += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Email:`, 14, i);
      doc.setFont("helvetica", "normal");
      doc.text(`${this.quotation.supplier.email}`, 28, i);

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
          PrecioUnitario: item.price,
          PrecioTotal: item.price,
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
      i += 10;
      doc.autoTable({
        startY: i,
        head: [headers],
        body: rows,
        theme: "grid",
        styles: {
          fillColor: [27, 38, 44],
          textColor: 255,
        },
        headStyles: {
          ffillColor: [58, 133, 255, 0.39],
          textColor: [255, 255, 255],
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
      });

      // Guarda el documento como PDF
      doc.save("Cotización.pdf");
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
