/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      product: {
        cucopId: "",
        name: "",
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
    if (!isNaN(this.id)) this.loadProduct();
  },
  methods: {
    loadProduct: async function () {
      try {
        const request = await axios.get(`/cucop/api/products/${this.id}`);
        this.product = request.data.product;
        this.product.active = this.product.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return !this.product.cucopId || !this.product.name;
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
          result = await axios.post("/cucop/api/products", this.product);
        } else {
          result = await axios.put(
            `/cucop/api/products/${this.id}`,
            this.product,
          );
        }
        this.code = result.status;
        if (this.code == 200) {
          window.location.replace(`/cucop/products`);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
