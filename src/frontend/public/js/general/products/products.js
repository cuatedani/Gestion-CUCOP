/* eslint-disable no-undef */
import { filteringProducts } from "/cucop/public/js/general/products/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      cucopId: "",
      name: "",
      description: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      products: [],
    };
  },
  mounted() {
    this.loadProducts();
  },
  computed: {
    filteredProducts() {
      return filteringProducts(this);
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
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.products.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).productId -
            (this.sortByIdDes ? b : a).productId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
