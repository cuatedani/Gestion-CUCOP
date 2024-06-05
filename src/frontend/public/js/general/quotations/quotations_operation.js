/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      quotation: {
        supplierId: "",
        price: "",
        description: "",
        active: true,
      },
      id: "",
      code: 0,
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
    if (!isNaN(this.id)) this.loadQuotation();
  },
  methods: {
    loadQuotation: async function () {
      try {
        const request = await axios.get(`/cucop/api/quotations/${this.id}`);
        this.quotation = request.data.quotation;
        this.quotation.active = this.quotation.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return !this.quotation.supplierId || !this.quotation.price;
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
          result = await axios.post("/cucop/api/quotations", this.quotation);
          window.location.replace(`/cucop/quotations`);
        } else {
          result = await axios.put(
            `/cucop/api/quotations/${this.id}`,
            this.quotation,
          );
          window.location.replace(`/cucop/quotations`);
        }
        this.code = result.status;
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
