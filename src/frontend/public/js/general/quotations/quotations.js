/* eslint-disable no-undef */
import { filteringQuotations } from "/cucop/public/js/general/quotations/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      listId: "",
      supplierId: "",
      description: "",
      date: "",
      quotNumber: "",
      active: "1",
      supplier: {
        name: "",
      },
      list: {
        title: "",
        user: {
          firstNames: "",
          lastNames: "",
        },
        description: "",
        status: "",
        active: 0,
      },
      wherever: "",
      supplied: "",
      quotations: [],
      data: [],
      showTableInfo: true,
      showExtraFilters: false,
    };
  },
  mounted() {
    const href = window.location.href;
    const lid = href.split("/")[5];
    try {
      this.listId = parseInt(lid);
    } catch (ex) {
      this.listId = 0;
    }
    this.loadList();
    this.loadQuotations();
  },
  computed: {
    filteredQuotations() {
      return filteringQuotations(this).map((quot) => ({
        ...quot,
        description: this.highlight(
          quot.description,
          this.description || this.wherever,
        ),
        date: this.highlight(
          new Date(quot.date).toLocaleDateString("es-ES"),
          this.date || this.wherever,
        ),
        quotNumber: this.highlight(
          quot.quotNumber,
          this.quotNumber || this.wherever,
        ),
        supplier: {
          ...quot.supplier,
          name: this.highlight(
            quot.supplier.name,
            this.supplied || this.wherever,
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
    loadList: async function () {
      try {
        const request = await axios.get("/cucop/api/lists/" + this.listId);
        this.list = request.data.list;
      } catch (ex) {
        console.log(ex);
        this.list = {};
      }
    },
    loadQuotations: async function () {
      try {
        const request = await axios.get(
          `/cucop/api/list/quotations/${this.listId}`,
        );
        this.quotations = request.data.quotations || [];
        this.data = this.quotations;
      } catch (ex) {
        console.log(ex);
        this.quotations = [];
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.quotationId == id);
      if (data) {
        $("#modalDeleteBody").html(`
          <p>¿Estás seguro de eliminar esta cotización?</p>
          <p><b>${data.description}</b></p>
        `);
        $("#modalDelete").modal("toggle");
        this.id = id;
      }
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/quotations/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadQuotations();
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
