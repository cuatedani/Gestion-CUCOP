/* eslint-disable no-undef */

const { createApp } = Vue;

createApp({
  data() {
    return {
      startDate: "",
      endDate: "",
      customerId: "",
      customers: [],
      code: 0,
    };
  },
  mounted() {
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
    sendReport: async function () {
      try {
        const request = await axios.get(
          `/time/api/reports?startDate=${this.startDate}&endDate=${this.endDate}&customerId=${this.customerId}`,
        );
        window.location =
          `/time/public/reports/` + request.data.fileName + ".xlsx";
        this.code = 200;
      } catch (ex) {
        this.code = 400;
        console.log(ex);
      }
    },
  },
}).mount("#app");
