/* eslint-disable no-undef */
import { filteringProducts } from "/cucop/public/js/general/products/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      cucopId: "",
      name: "",
      description: "",
      active: "1",
      cucop: {
        descripcion: "",
        descpartidaespecifica: "",
      },
      wherever: "",
      iscucop: "",
      data: [],
      products: [],
      currentPage: 1,
      itemsPerPage: 20,
      showExtraFilters: false,
    };
  },
  mounted() {
    this.loadProducts();
  },
  computed: {
    filteredProducts() {
      return filteringProducts(this).map((product) => ({
        ...product,
        name: this.highlight(product.name, this.name || this.wherever),
        description: this.highlight(
          product.description,
          this.description || this.wherever,
        ),
        cucop: {
          ...product.cucop,
          descripcion: this.highlight(
            product.cucop.descripcion,
            this.iscucop || this.wherever,
          ),
          descpartidaespecifica: this.highlight(
            product.cucop.descpartidaespecifica,
            this.iscucop || this.wherever,
          ),
        },
      }));
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedResult = this.filteredProducts.slice(start, end);
      return paginatedResult;
    },
    totalPages() {
      const totalPages = Math.ceil(
        this.filteredProducts.length / this.itemsPerPage,
      );
      return totalPages;
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
    },
  },
  methods: {
    loadProducts: async function () {
      try {
        const request = await axios.get("/cucop/api/products");
        this.data = request.data.products;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.productId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este producto?</p>
      <p><b>${data.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/products/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadProducts();
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
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
