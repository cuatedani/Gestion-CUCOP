/* eslint-disable no-undef */
import { filteringLists } from "/cucop/public/js/general/lists/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      userId: "",
      title: "",
      description: "",
      status: "",
      active: "1",
      user: {
        firstNames: "",
        lastNames: "",
      },
      wherever: "",
      owner: "",
      data: [],
      showExtraFilters: false,
    };
  },
  mounted() {
    this.loadLists();
  },
  computed: {
    filteredLists() {
      return filteringLists(this).map((list) => ({
        ...list,
        title: this.highlight(list.title, this.title || this.wherever),
        description: this.highlight(
          list.description,
          this.description || this.wherever,
        ),
        user: {
          ...list.user,
          lastNames: this.highlight(
            list.user.lastNames,
            this.owner || this.wherever,
          ),
          firstNames: this.highlight(
            list.user.firstNames,
            this.owner || this.wherever,
          ),
        },
      }));
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
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
      <p><b>${data.title}</b></p>
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
