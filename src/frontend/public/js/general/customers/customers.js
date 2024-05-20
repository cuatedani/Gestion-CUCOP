/* eslint-disable no-undef */
import { filteringCustomers } from "/time/public/js/general/customers/filters.js";
const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      rol: "",
      name: "",
      institution: "",
      address: "",
      phone: "",
      email: "",
      wherever: "",
      active: "1",
      type: "",
      data: [],
      id: "",
      sortDesById: false,
    };
  },
  mounted() {
    this.loadCustomers();
  },
  computed: {
    filteredCustomers() {
      return filteringCustomers(this);
    },
  },
  methods: {
    loadCustomers: async function () {
      try {
        const request = await axios.get("/time/api/customers");
        this.data = request.data.customers;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    showDialog: function (id) {
      const data = this.data.find((tmp) => tmp.customerId == id);
      $("#modalDeleteBody").html(`
      <p>¿Estás seguro de eliminar el cliente interno?</p>
      <p><b>${data.contact.name}</b></p>
      `);
      $("#modalDelete").modal("toggle");
      this.loadCustomers();
      this.id = id;
    },
    delete: async function () {
      try {
        await axios.delete(`/time/api/customers/${this.id}`);
        $("#modalDelete").modal("toggle");
        this.loadCustomers();
      } catch (ex) {
        console.log(ex);
      }
    },
    sort: function (type) {
      if (type == "id") {
        this.sortDesById = !this.sortDesById;
        this.data.sort(
          (a, b) =>
            (this.sortDesById ? a : b).customerId -
            (this.sortDesById ? b : a).customerId,
        );
      }
    },
  },
}).mount("#app");

$("#btnDelete").click(() => {
  app.delete();
});
