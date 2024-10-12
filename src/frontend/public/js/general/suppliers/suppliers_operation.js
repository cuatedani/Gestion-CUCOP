/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      supplier: {
        name: "",
        description: "",
        tin: "",
        phone: "",
        address: "",
        email: "",
        active: true,
      },
      id: "",
      code: 0,
      areas: [],
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
    if (!isNaN(this.id)) this.loadSupplier();
  },
  methods: {
    loadSupplier: async function () {
      try {
        const request = await axios.get(`/cucop/api/suppliers/${this.id}`);
        this.supplier = request.data.supplier;
        this.supplier.active = this.supplier.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return !this.supplier.name || !this.supplier.tin;
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
          result = await axios.post("/cucop/api/suppliers", this.supplier);
          window.location.replace(`/cucop/suppliers`);
        } else {
          result = await axios.put(
            `/cucop/api/suppliers/${this.id}`,
            this.supplier,
          );
          window.location.replace(`/cucop/suppliers`);
        }
        this.code = result.status;
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
