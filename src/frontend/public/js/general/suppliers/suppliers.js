/* eslint-disable no-undef */
import { filteringSuppliers } from "/cucop/public/js/general/suppliers/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      name: "",
      description: "",
      tin: "",
      phone: "",
      address: "",
      email: "",
      active: "1",
      wherever: "",
      data: [],
      showExtraFilters: false,
    };
  },
  mounted() {
    this.loadSuppliers();
  },
  computed: {
    filteredSuppliers() {
      return filteringSuppliers(this).map((supplier) => ({
        ...supplier,
        name: this.highlight(supplier.name, this.name || this.wherever),
        description: this.highlight(
          supplier.description,
          this.description || this.wherever,
        ),
        tin: this.highlight(supplier.tin, this.tin || this.wherever),
        phone: this.highlight(supplier.phone, this.phone || this.wherever),
        address: this.highlight(
          supplier.address,
          this.address || this.wherever,
        ),
        email: this.highlight(supplier.email, this.email || this.wherever),
      }));
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
    },
  },
  methods: {
    loadSuppliers: async function () {
      try {
        const request = await axios.get("/cucop/api/suppliers");
        this.data = request.data.suppliers;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.supplierId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este proveedor?</p>
      <p><b>${data.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/suppliers/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadSuppliers();
      } catch (ex) {
        console.log(ex);
      }
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
