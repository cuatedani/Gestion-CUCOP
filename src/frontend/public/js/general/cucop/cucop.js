/* eslint-disable no-undef */
const { createApp } = Vue;
import { filteringCucop } from "/cucop/public/js/general/cucop/filters.js";

const app = createApp({
  data() {
    return {
      id: "",
      clavecucop: "",
      descripcion: "",
      unidaddemedida: "",
      tipodecontratacion: "",
      partidaespecifica: "",
      partidagenerica: "",
      concepto: "",
      capitulo: "",
      wherever: "",
      data: [],
      currentPage: 1,
      itemsPerPage: 20,
      showExtraFilters: false,
    };
  },
  mounted() {
    this.loadCucop();
  },
  computed: {
    filteredCucop() {
      return filteringCucop(this).map((cucop) => ({
        ...cucop,
        clavecucop: this.highlight(
          cucop.clavecucop,
          this.clavecucop || this.wherever,
        ),
        descripcion: this.highlight(
          cucop.descripcion,
          this.descripcion || this.wherever,
        ),
        unidaddemedida: this.highlight(
          cucop.unidaddemedida,
          this.unidaddemedida || this.wherever,
        ),
        tipodecontratacion: this.highlight(
          cucop.tipodecontratacion,
          this.tipodecontratacion || this.wherever,
        ),
        partidaespecifica: this.highlight(
          cucop.partidaespecifica,
          this.partidaespecifica || this.wherever,
        ),
        descpartidaespecifica: this.highlight(
          cucop.descpartidaespecifica,
          this.partidaespecifica || this.wherever,
        ),
        partidagenerica: this.highlight(
          cucop.partidagenerica,
          this.partidagenerica || this.wherever,
        ),
        descpartidagenerica: this.highlight(
          cucop.descpartidagenerica,
          this.partidagenerica || this.wherever,
        ),
        concepto: this.highlight(
          cucop.concepto,
          this.concepto || this.wherever,
        ),
        descconcepto: this.highlight(
          cucop.descconcepto,
          this.concepto || this.wherever,
        ),
        capitulo: this.highlight(
          cucop.capitulo,
          this.capitulo || this.wherever,
        ),
        desccapitulo: this.highlight(
          cucop.desccapitulo,
          this.capitulo || this.wherever,
        ),
      }));
    },
    paginatedCucop() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedResult = this.filteredCucop.slice(start, end);
      return paginatedResult;
    },
    totalPages() {
      const totalPages = Math.ceil(
        this.filteredCucop.length / this.itemsPerPage,
      );
      return totalPages;
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
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
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handlePageInput() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      } else if (this.currentPage < 1) {
        this.currentPage = 1;
      }
    },
    validatePage() {
      if (isNaN(this.currentPage) || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
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
    exportData() {
      // Crea un libro de trabajo de XLSX
      const workbook = XLSX.utils.book_new();

      // Filtra y transforma los datos para la exportación
      const modifiedData = this.data.map((item) => ({
        "Clave CUCoP": item.clavecucop,
        Descripción: item.descripcion,
        "Unidad de Medida": item.unidaddemedida,
        "Tipo de Contratación": item.tipodecontratacion,
        "Partida Especifica": item.partidaespecifica,
        "Desc Partida Especifica": item.descpartidaespecifica,
        "Partida Generica": item.partidagenerica,
        "Desc Partida Generica": item.descpartidagenerica,
        Concepto: item.concepto,
        "Desc Concepto": item.descconcepto,
        Capitulo: item.capitulo,
        "Desc Capitulo": item.desccapitulo,
      }));

      // Convierte los datos modificados a una hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(modifiedData);

      // Añade la hoja de cálculo al libro de trabajo
      XLSX.utils.book_append_sheet(workbook, worksheet, "RegistrosCUCop");

      // Exporta el libro de trabajo a un archivo .xlsx
      XLSX.writeFile(workbook, "RegistrosCUCop.xlsx");
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
