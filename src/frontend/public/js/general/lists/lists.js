/* eslint-disable no-undef */
import { filteringLists } from "/cucop/public/js/general/lists/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      userId: "",
      status: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      lists: [],
    };
  },
  mounted() {
    this.loadLists();
  },
  computed: {
    filteredLists() {
      return filteringLists(this);
    },
  },
  methods: {
    loadLists: async function () {
      try {
        const request = await axios.get("/cucop/api/lists");
        this.data = request.data.lists;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.listId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar esta lista?</p>
      <p><b>${data.listId}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/lists/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadLists();
      } catch (ex) {
        console.log(ex);
      }
    },
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.lists.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).listId -
            (this.sortByIdDes ? b : a).listId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
