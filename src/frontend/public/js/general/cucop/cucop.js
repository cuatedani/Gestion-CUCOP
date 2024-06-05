/* eslint-disable no-undef */
import { filteringCucop } from "/cucop/public/js/general/cucop/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      clavecucopid: "",
      clavecucop: "",
      descripcion: "",
      unidaddemedida: "",
      tipodecontratacion: "",
      partidaespecifica: "",
      descpartidaespecifica: "",
      partidagenerica: "",
      descpartidagenerica: "",
      concepto: "",
      descconcepto: "",
      capitulo: "",
      desccapitulo: "",
      fechaalta: "",
      fechamodificacion: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      cucop: [],
    };
  },
  mounted() {
    this.loadCucop();
  },
  computed: {
    filteredCucop() {
      return filteringCucop(this);
    },
  },
  methods: {
    loadCucop: async function () {
      try {
        const request = await axios.get("/cucop/api/cucop");
        this.data = request.data.cucop;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.cucopId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este registro cucop?</p>
      <p><b>${data.clavecucopid}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/cucop/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadCucop();
      } catch (ex) {
        console.log(ex);
      }
    },
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.cucop.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).cucopId -
            (this.sortByIdDes ? b : a).cucopId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
