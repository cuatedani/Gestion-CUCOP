/* eslint-disable no-undef */
import { filteringListProducts } from "/cucop/public/js/general/listproducts/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      listId: "",
      productId: "",
      quantity: "",
      price: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      listproducts: [],
    };
  },
  mounted() {
    this.loadListProducts();
  },
  computed: {
    filteredListProducts() {
      return filteringListProducts(this);
    },
  },
  methods: {
    loadListProducts: async function () {
      try {
        const request = await axios.get("/cucop/api/list-products");
        this.data = request.data.listproducts || [];
        console.log(request.data.listproducts);
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.listProductId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este producto?</p>
      <p><b>${data.name} de la lista ${data.listId}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/list-products/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadListProducts();
      } catch (ex) {
        console.log(ex);
      }
    },
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.listproducts.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).listProductId -
            (this.sortByIdDes ? b : a).listProductId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
