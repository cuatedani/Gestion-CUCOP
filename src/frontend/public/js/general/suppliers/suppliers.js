/* eslint-disable no-undef */
import { filteringSuppliers } from "/cucop/public/js/general/suppliers/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      name: "",
      description: "",
      tin: "",
      phone: "",
      address: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      suppliers: [],
    };
  },
  mounted() {
    this.loadSuppliers();
  },
  computed: {
    filteredSuppliers() {
      return filteringSuppliers(this);
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
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.suppliers.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).supplierId -
            (this.sortByIdDes ? b : a).supplierId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
