/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      list: {
        userId: "",
        title: "",
        description: "",
        status: "creada",
        active: true,
      },
      users: [],
      id: "",
      code: 0,
    };
  },
  async mounted() {
    const href = window.location.href;
    const id = href.split("/")[5];
    try {
      this.id = parseInt(id);
    } catch (ex) {
      this.id = 0;
    }
    try {
      const request = await axios.get("/cucop/api/users");
      this.users = request.data.users.filter((user) => user.active);
    } catch (ex) {
      console.log(ex);
      this.users = [];
    }
    if (!isNaN(this.id)) this.loadList();
  },
  methods: {
    loadList: async function () {
      try {
        const request = await axios.get(`/cucop/api/lists/${this.id}`);
        this.list = request.data.list;
        this.list.active = this.list.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return !this.list.userId || !this.list.title;
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
          result = await axios.post("/cucop/api/lists", this.list);
        } else {
          result = await axios.put(`/cucop/api/lists/${this.id}`, this.list);
        }
        this.code = result.status;
        if (this.code == 200) {
          setTimeout(() => {
            window.location.replace(`/cucop/lists`);
          }, 1500);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
