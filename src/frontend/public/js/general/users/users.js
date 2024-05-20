/* eslint-disable no-undef */
import { filteringUsers } from "/time/public/js/general/users/filters.js";

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      firstNames: "",
      lastNames: "",
      email: "",
      rol: "",
      active: "1",
      id: "",
      sortByIdDes: false,
      data: [],
      users: [],
    };
  },
  mounted() {
    this.loadUsers();
  },
  computed: {
    filteredUsers() {
      return filteringUsers(this);
    },
  },
  methods: {
    loadUsers: async function () {
      try {
        const request = await axios.get("/time/api/users");
        this.data = request.data.users;
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
        await axios.delete(`/time/api/users/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadUsers();
      } catch (ex) {
        console.log(ex);
      }
    },
    sort: function (type) {
      if (type == "id") {
        this.sortByIdDes = !this.sortByIdDes;
        this.users.sort(
          (a, b) =>
            (this.sortByIdDes ? a : b).userId -
            (this.sortByIdDes ? b : a).userId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
