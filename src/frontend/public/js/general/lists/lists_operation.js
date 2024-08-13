/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: "",
      list: {
        userId: "",
        title: "",
        description: "",
        status: "Creada",
        active: true,
        user: {
          firstNames: "",
          lastNames: "",
        },
      },
      userName: "",
      users: [],
      usersData: [],
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
      this.usersData = this.users;
    } catch (ex) {
      this.users = [];
      this.usersData = [];
    }
    if (!isNaN(this.id)) this.loadList();
  },
  computed: {
    filteredUsers() {
      const usersData = this.filteringUsers().map((user) => {
        return {
          ...user,
          userName: `${user.firstNames} ${user.lastNames}`,
        };
      });
      console.log(usersData);
      return [...usersData].slice(0, 3);
    },
  },
  methods: {
    loadList: async function () {
      try {
        const request = await axios.get(`/cucop/api/lists/${this.id}`);
        this.list = request.data.list;
        this.userName =
          this.list.user.firstNames + " " + this.list.user.lastNames;
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
    filteringUsers: function () {
      let newUserData = [];
      if (this.userName) {
        const seachtext = this.userName.toLowerCase();
        newUserData = this.users.filter((user) => {
          const name = user.firstNames + " " + user.lastNames;
          return name.toLowerCase().includes(seachtext);
        });
      } else {
        newUserData = this.users;
      }
      return [...newUserData];
    },
    searchFieldSelectItem: function (item, type) {
      this.handleSearchSelection(item, type);
    },
    searchFieldFocus: function (evt, type) {
      this.searchFieldShowList(type);
    },
    searchFieldBlur: function (evt, type) {
      this.searchFieldHideList(type);
      const text = evt.target.value;
      if (text == "") this.handleSearchSelection(null, type);
    },
    searchFieldKeyUp: function (evt, type) {
      if (!this.searchFieldIsShowed(type)) this.searchFieldShowList(type);
    },
    handleSearchSelection: function (item, type) {
      if (type === "userName" && item) {
        this.userName = item.userName;
        this.list.userId = item.userId; // Asegúrate de asociar correctamente el ID del usuario seleccionado
      }
    },
    searchFieldIsShowed: function (type) {
      if (type === "userName") {
        return this.usersData.length > 0;
      }
      return false;
    },
    searchFieldShowList: function (type) {
      if (type == "supplierName") {
        this.showSearchSupplierFieldData = true;
      }
    },
    searchFieldHideList: function (type) {
      if (type == "supplierName") {
        this.showSearchSupplierFieldData = false;
      }
    },
  },
}).mount("#app");
