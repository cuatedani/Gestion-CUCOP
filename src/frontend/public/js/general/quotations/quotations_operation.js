/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: "",
      quotation: {
        listId: "",
        supplierId: "",
        description: "",
        date: "",
        quotNumber: "",
        active: true,
        supplier: {
          name: "",
        },
      },
      supplierName: "",
      suppliers: [],
      data: [],
      code: 0,
      showSearchSupplierFieldData: false,
    };
  },
  async mounted() {
    const href = window.location.href;
    const id = href.split("/")[7];
    try {
      this.id = parseInt(id);
    } catch (ex) {
      this.id = 0;
    }
    console.log("QuotationId: ", this.id);

    const lid = href.split("/")[5];
    try {
      this.quotation.listId = parseInt(lid);
    } catch (ex) {
      this.quotation.listId = 0;
    }
    console.log("listId: ", this.quotation.listId);

    try {
      const request = await axios.get("/cucop/api/suppliers");
      this.suppliers = request.data.suppliers.filter(
        (supplier) => supplier.active,
      );
      this.data = this.suppliers;
    } catch (ex) {
      console.log(ex);
      this.suppliers = [];
      this.data = [];
    }

    if (!isNaN(this.id)) this.loadQuotation();
  },
  computed: {
    filteredSuppliers() {
      const data = this.filteringSuppliers();
      return [...data].slice(0, 3);
    },
  },
  methods: {
    loadQuotation: async function () {
      try {
        const request = await axios.get(
          `/cucop/api/quotations/${this.quotation.listId}`,
        );
        this.quotation = request.data.quotation;

        let date = new Date(this.quotation.date);
        date = date.toISOString().split("T")[0];
        this.quotation.date = date;

        this.quotation.active = this.quotation.active == 1;

        this.supplierName = this.quotation.supplier.name;
      } catch (ex) {
        console.log(ex);
        this.quotation = {};
      }
    },
    loadSuppliers: async function () {
      try {
        const request = await axios.get(`/cucop/api/suppliers`);
        this.suppliers = request.data.suppliers;
      } catch (ex) {
        console.log(ex);
        this.suppliers = [];
      }
    },
    validateEmpty: function () {
      return (
        !this.quotation.supplierId ||
        !this.quotation.description ||
        !this.quotation.date
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
          result = await axios.post("/cucop/api/quotations", this.quotation);
        } else {
          result = await axios.put(
            `/cucop/api/quotations/${this.id}`,
            this.quotation,
          );
        }
        this.code = result.status;
        if (this.code == 200) {
          setTimeout(() => {
            window.location.replace(`/cucop/lists/${this.quotation.listId}`);
          }, 1500);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
    filteringSuppliers: function () {
      let newsuppdata = [];
      if (this.supplierName) {
        const seachtext = this.supplierName.toLowerCase();
        newsuppdata = this.suppliers.filter((supplier) => {
          return (
            supplier.name && supplier.name.toLowerCase().includes(seachtext)
          );
        });
      } else {
        newsuppdata = this.suppliers;
      }
      return [...newsuppdata];
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
      if (type == "supplierName") {
        this.supplierName = item.name;
        this.quotation.supplierId = item.supplierId;
      }
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
    searchFieldIsShowed: function (type) {
      if (type == "supplierName") {
        return this.showSearchSupplierFieldData;
      }
    },
  },
}).mount("#app");
