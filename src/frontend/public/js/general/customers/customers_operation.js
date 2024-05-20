/* eslint-disable no-undef */
const { createApp } = Vue;

createApp({
  data() {
    return {
      customer: {
        rol: "",
        targetHours: 0,
        adjustHours: 0,
        contact: {
          contactId: "",
          name: "",
          country: "México",
          state: "Nayarit",
          municipality: "Tepic",
          suburb: "Ciudad del conocimiento",
          street: "Andador 10",
          cardinalPoint: "",
          number: "21",
          cp: "631773",
          phone1: "",
          phone2: "",
          email1: "",
          email2: "",
          web: "https://ut3.cicese.mx",
          type: "Interno",
          active: true,
        },
        active: true,
      },
      contacts: [],
      isDisabled: true,
      id: "",
      code: 0,
      isValid: {
        contact: true,
        customer: true,
      },
    };
  },
  mounted() {
    const href = window.location.href;
    const id = href.split("/")[5];
    try {
      this.id = parseInt(id);
    } catch (ex) {
      this.id = 0;
    }
    if (!isNaN(this.id)) this.loadCustomer();
  },
  methods: {
    loadCustomer: async function () {
      try {
        const request = await axios.get(`/time/api/customers/${this.id}`);
        this.customer = request.data.customer;
        this.customer.active = this.customer.active == 1;
      } catch (ex) {
        console.log(ex);
      }
    },
    validateEmpty: function () {
      return (
        !this.customer.rol ||
        !this.customer.targetHours ||
        !this.customer.institution ||
        !this.customer.contact.name ||
        !this.customer.contact.country ||
        !this.customer.contact.state ||
        !this.customer.contact.municipality ||
        !this.customer.contact.suburb ||
        !this.customer.contact.street ||
        !this.customer.contact.number
      );
    },
    sendForm: async function () {
      this.code = 0;
      if (this.validateEmpty()) {
        this.code = -1;
        return;
      }
      try {
        let result;
        if (isNaN(this.id)) {
          result = await axios.post("/time/api/customers", this.customer);
          window.location = document.referrer;
        } else {
          result = await axios.put(
            `/time/api/contacts/${this.customer.contactId}`,
            this.customer.contact,
          );
          result = await axios.put(
            `/time/api/customers/${this.id}`,
            this.customer,
          );
        }
        this.code = result.status;
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
