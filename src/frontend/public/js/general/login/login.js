/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      email: "",
      password: "",
      code: 0,
    };
  },
  methods: {
    sendForm: async function () {
      const data = {
        email: this.email,
        password: this.password,
      };
      this.code = 0;
      try {
        const result = await axios.post("/cucop/api/login", data);
        this.code = result.code;
        window.location.replace(
          `/cucop/login/verify?token=${result.data.token}`,
        );
      } catch (ex) {
        console.log(ex);
        this.code = ex.response.status;
      }
    },
  },
}).mount("#login-form");
