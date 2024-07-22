/* eslint-disable no-undef */
import { filteringUsers } from "/cucop/public/js/general/users/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      id: "",
      firstNames: "",
      lastNames: "",
      email: "",
      rol: "",
      active: "1",
      wherever: "",
      data: [],
      showExtraFilters: false,
    };
  },
  mounted() {
    this.loadUsers();
  },
  computed: {
    filteredUsers() {
      return filteringUsers(this).map((user) => ({
        ...user,
        firstNames: this.highlight(
          user.firstNames,
          this.wherever || this.firstNames,
        ),
        lastNames: this.highlight(
          user.lastNames,
          this.wherever || this.lastNames,
        ),
        email: this.highlight(user.email, this.wherever || this.email),
      }));
    },
    extraFiltersButtonText() {
      return this.showExtraFilters ? "Ocultar filtros" : "Mostrar filtros";
    },
  },
  methods: {
    loadUsers: async function () {
      try {
        const request = await axios.get("/cucop/api/users");
        this.data = request.data.users;
        this.users = [...this.data];
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.userId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar este usuario?</p>
      <p><b>${data.firstNames} ${data.lastNames}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/cucop/api/users/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadUsers();
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
