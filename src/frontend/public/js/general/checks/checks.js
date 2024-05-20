/* eslint-disable no-undef */
import { filteringChecks } from "/time/public/js/general/checks/filters.js";
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      rol: "",
      name: "",
      institution: "",
      type: "",
      startDate: "",
      endDate: "",
      wherever: "",
      active: "1",
      data: [],
      id: "",
      sortDesById: false,
    };
  },
  mounted() {
    this.loadChecks();
  },
  computed: {
    filteredChecks() {
      return filteringChecks(this);
    },
  },
  methods: {
    loadChecks: async function () {
      try {
        const request = await axios.get("/time/api/checks");
        this.data = request.data.checks;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.checkId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar el registro?</p>
      <p><b>${data.customer.contact.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.loadChecks();
      this.id = id;
    },
    sort: function (type) {
      if (type == "id") {
        this.sortDesById = !this.sortDesById;
        this.data.sort(
          (a, b) =>
            (this.sortDesById ? a : b).checkId -
            (this.sortDesById ? b : a).checkId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
