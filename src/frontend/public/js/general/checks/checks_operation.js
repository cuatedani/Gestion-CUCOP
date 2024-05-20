/* eslint-disable no-undef */

const { createApp } = Vue;

createApp({
  data() {
    return {
      customers: [],
      code: "",
      toastBootstrap: null,
    };
  },
  mounted() {
    const toastLiveExample = document.getElementById("liveToast");
    this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    this.loadCustomers();
  },
  methods: {
    loadCustomers: async function () {
      try {
        const request = await axios.get(`/time/api/customers?status=active`);
        this.customers = request.data.customers;
      } catch (ex) {
        console.log(ex);
      }
    },
    checkIn: async function (id) {
      try {
        await axios.post(`/time/api/checks/${id}`, { type: "check_in" });
        this.loadCustomers();
        this.code = 1;
        this.toastBootstrap.show();
      } catch (ex) {
        console.log(ex);
      }
    },
    checkOut: async function (id) {
      try {
        await axios.post(`/time/api/checks/${id}`, { type: "check_out" });
        this.loadCustomers();
        this.code = 2;
        this.toastBootstrap.show();
      } catch (ex) {
        console.log(ex);
      }
    },
    justify: async function (id) {
      try {
        await axios.post(`/time/api/checks/${id}`, { type: "justify" });
        this.loadCustomers();
        this.code = 3;
        this.toastBootstrap.show();
      } catch (ex) {
        console.log(ex);
      }
    },
    validateEmpty: function () {
      return !this.check.customer.customerId || !this.check.type;
    },
  },
}).mount("#app");
