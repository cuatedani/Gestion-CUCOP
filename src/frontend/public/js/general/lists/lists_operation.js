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
      code: 0,
      showSearchUserFieldData: false,
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
      this.users = request.data.users
        .filter((user) => user.active)
        .map((user) => {
          return {
            ...user,
            userName: `${user.firstNames} ${user.lastNames}`,
          };
        });
    } catch (ex) {
      this.users = [];
    }
    if (!isNaN(this.id)) this.loadList();
  },
  computed: {
    filteredUsers() {
      const data = this.filteringUsers();
      console.log(data);
      return [...data];
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
        this.list = null;
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
          console.log(user);
          return (
            user.userName && user.userName.toLowerCase().includes(seachtext)
          );
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
    handleSearchSelection: async function (item, type) {
      if (type == "userName") {
        if (item) {
          this.userName = item.userName;
          this.list.userId = item.userId;
        }
      }
    },
    searchFieldShowList: function (type) {
      if (type == "userName") {
        this.showSearchUserFieldData = true;
      }
    },
    searchFieldIsShowed: function (type) {
      if (type == "userName") {
        return this.showSearchUserFieldData;
      }
    },
    searchFieldHideList: function (type) {
      if (type == "userName") {
        this.showSearchUserFieldData = false;
      }
    },
  },
}).mount("#app");
