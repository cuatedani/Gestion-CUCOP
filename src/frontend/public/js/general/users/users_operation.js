/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      user: {
        firstNames: "",
        lastNames: "",
        password: "",
        email: "",
        rol: "",
        active: true,
      },
      initialPassword: "",
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
    if (!isNaN(this.id)) this.loadUser();
  },
  methods: {
    loadUser: async function () {
      try {
        const request = await axios.get(`/cucop/api/users/${this.id}`);
        this.user = request.data.user;
        this.user.active = this.user.active == 1;
        this.initialPassword = this.user.password;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return (
        !this.user.firstNames ||
        !this.user.lastNames ||
        !this.user.email ||
        !this.user.password ||
        !this.user.rol
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
          result = await axios.post("/cucop/api/users", this.user);
          window.location.replace(`/cucop/users`);
        } else {
          if (this.initialPassword == this.user.password)
            delete this.user.password;
          result = await axios.put(`/cucop/api/users/${this.id}`, this.user);
        }
        this.code = result.status;
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
