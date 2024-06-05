/* eslint-disable no-undef */
import { filteringQuotations } from "/cucop/public/js/general/quotations/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      supplierId: "",
      price: "",
      description: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [], // Inicializado como array vacío
      quotations: [], // Inicializado como array vacío
    };
  },
  mounted() {
    this.loadQuotations();
  },
  computed: {
    filteredQuotations() {
      return filteringQuotations(this);
    },
  },
  methods: {
    loadQuotations: async function () {
      try {
        const request = await axios.get("/cucop/api/quotations");
        this.data = request.data.quotations || []; // Asegúrate de que es un array
      } catch (ex) {
        console.log(ex);
        this.data = []; // Asegúrate de que se asigna un array en caso de error
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
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.quotations.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).quotationId -
            (this.sortByIdDes ? b : a).quotationId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
