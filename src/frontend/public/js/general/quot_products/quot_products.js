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
      active: true,
      quotation: {
        quotationId: "",
        description: "",
        quotNumber: "",
        date: "",
        active: 0,
        createdAt: "",
        supplier: {
          name: "",
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
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
