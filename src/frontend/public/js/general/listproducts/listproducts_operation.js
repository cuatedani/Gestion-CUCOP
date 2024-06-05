/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      listproduct: {
        listId: "",
        productId: "",
        quantity: "",
        price: "",
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
    if (!isNaN(this.id)) this.loadListProduct();
  },
  methods: {
    loadListProduct: async function () {
      try {
        const request = await axios.get(`/cucop/api/list-products/${this.id}`);
        this.listproduct = request.data.listproduct;
        this.listproduct.active = this.listproduct.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return (
        !this.listproduct.listId ||
        !this.listproduct.productId ||
        !this.listproduct.quantity ||
        !this.listproduct.price
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
          result = await axios.post(
            "/cucop/api/list-products",
            this.listproduct,
          );
        } else {
          result = await axios.put(
            `/cucop/api/list-products/${this.id}`,
            this.listproduct,
          );
        }
        this.code = result.status;
        if (this.code == 200) {
          window.location.replace(`/cucop/list-products`);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
