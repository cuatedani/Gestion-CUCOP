/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: "",
      listId: "",
      quotProduct: {
        productId: "",
        quotationId: "",
        quantity: "",
        price: "",
        total: "",
        details: "",
        active: true,
      },
      product: {
        cucopId: "",
        name: "",
        description: "",
        active: true,
      },
      cucopelement: {
        cucopId: "",
        clavecucop: "",
        descripcion: "",
        partidaespecifica: "",
        descpartidaespecifica: "",
        partidagenerica: "",
        descpartidagenerica: "",
        concepto: "",
        descconcepto: "",
        capitulo: "",
        desccapitulo: "",
      },
      productName: "",
      supplierName: "",
      cucopDesc: "",
      products: [],
      cucop: [],
      productsData: [],
      cucopdata: [],
      capitulo: "0",
      capitulos: [],
      concepto: "0",
      conceptos: [],
      generica: "0",
      genericas: [],
      especifica: "0",
      especificas: [],
      currentPage: 1,
      itemsPerPage: 10,
      code: 0,
      prodcode: 0,
      showSearchProductFieldData: false,
      apply: false,
    };
  },
  async mounted() {
    const href = window.location.href;
    const lid = href.split("/")[5];
    try {
      this.listId = parseInt(lid);
    } catch (ex) {
      this.listId = 0;
    }

    const qid = href.split("/")[7];
    try {
      this.quotProduct.quotationId = parseInt(qid);
    } catch (ex) {
      this.quotProduct.quotationId = 0;
    }

    const qpid = href.split("/")[9];
    try {
      this.id = parseInt(qpid);
    } catch (ex) {
      this.id = 0;
    }

    try {
      const request = await axios.get("/cucop/api/products");
      this.products = request.data.products.filter((product) => product.active);
      this.productsData = this.products;
    } catch (ex) {
      console.log(ex);
      this.products = [];
    }

    try {
      const request = await axios.get(`/cucop/api/cucop`);
      this.cucopdata = request.data.cucop;
    } catch (ex) {
      console.log(ex);
      this.cucopdata = [];
    }

    try {
      const request = await axios.get("/cucop/api/cucop/capitulos");
      this.capitulos = request.data.cucop;
    } catch (ex) {
      console.log(ex);
      this.capitulos = [];
    }

    if (!isNaN(this.id)) this.loadQuotProduct();
  },
  computed: {
    filteredProducts() {
      const productsData = this.filteringProducts();
      return [...productsData].slice(0, 3);
    },
    filteredCucop() {
      return this.filteringCucop(this).map((cucop) => ({
        ...cucop,
        descripcion: this.highlight(cucop.descripcion, this.cucopDesc),
        unidaddemedida: this.highlight(cucop.unidaddemedida, this.cucopDesc),
        tipodecontratacion: this.highlight(
          cucop.tipodecontratacion,
          this.cucopDesc,
        ),
        partidaespecifica: this.highlight(
          cucop.partidaespecifica,
          this.cucopDesc,
        ),
        descpartidaespecifica: this.highlight(
          cucop.descpartidaespecifica,
          this.cucopDesc,
        ),
        partidagenerica: this.highlight(cucop.partidagenerica, this.cucopDesc),
        descpartidagenerica: this.highlight(
          cucop.descpartidagenerica,
          this.cucopDesc,
        ),
        concepto: this.highlight(cucop.concepto, this.cucopDesc),
        descconcepto: this.highlight(cucop.descconcepto, this.cucopDesc),
        capitulo: this.highlight(cucop.capitulo, this.cucopDesc),
        desccapitulo: this.highlight(cucop.desccapitulo, this.cucopDesc),
      }));
    },
    paginatedCucop() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedResult = this.filteredCucop.slice(start, end);
      return paginatedResult;
    },
  },
  methods: {
    loadQuotProduct: async function () {
      try {
        const request = await axios.get(`/cucop/api/quot-products/${this.id}`);
        this.quotProduct = request.data.quotproduct;
        this.quotProduct.active = this.quotProduct.active == 1;
        await this.loadProduct();
      } catch (ex) {
        console.log(ex);
      }
    },
    loadProduct: async function () {
      try {
        const request = await axios.get(
          `/cucop/api/products/${this.quotProduct.productId}`,
        );
        this.product = request.data.product;
        this.productName = this.product.name;
        this.product.active = this.product.active == 1;
        await this.loadCucop();
      } catch (ex) {
        console.log(ex);
      }
    },
    loadCucop: async function () {
      try {
        const request = await axios.get(
          `/cucop/api/cucop/${this.product.cucopId}`,
        );
        this.cucopelement = request.data.cucop;
        this.capitulo = this.cucopelement.capitulo;
        await this.selectCapitulo();
        this.concepto = this.cucopelement.concepto;
        await this.selectConcepto();
        this.generica = this.cucopelement.partidagenerica;
        await this.selectPartidaGenerica();
        this.especifica = this.cucopelement.partidaespecifica;
        await this.selectPartidaEspecifica();
        this.cucopDesc = this.cucopelement.descripcion;
        cucop = [];
        try {
          const request = await axios.get(`/cucop/api/cucop`);
          this.cucopdata = request.data.cucop;
        } catch (ex) {
          console.log(ex);
          this.cucopdata = [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
    loadProducts: async function () {
      try {
        const request = await axios.get("/cucop/api/products");
        this.products = request.data.products.filter(
          (product) => product.active,
        );
      } catch (ex) {
        console.log(ex);
        this.products = [];
      }
    },
    loadCucops: async function () {
      try {
        const request = await axios.get(`/cucop/api/cucop`);
        this.cucopdata = request.data.cucop;
      } catch (ex) {
        console.log(ex);
        this.cucopdata = [];
      }
    },
    validateEmpty: function () {
      return (
        !this.quotProduct.productId ||
        !this.quotProduct.quantity ||
        !this.quotProduct.price
      );
    },
    validateEmptyProduct: function () {
      return !this.product.cucopId || !this.productName;
    },
    sendForm: async function () {
      await this.sendFormProduct();
      setTimeout(1500);
      this.prodcode = 0;
      this.code = 0;
      if (this.validateEmpty()) {
        console.log("No valido quotProduct");
        console.log(this.quotProduct);
        this.code = -1;
        return;
      }
      try {
        let result;
        if (isNaN(this.id)) {
          console.log("Añadiendo quotProduct" + this.quotProduct);
          result = await axios.post(
            "/cucop/api/quot-products",
            this.quotProduct,
          );
        } else {
          console.log("Editando quotProduct");
          result = await axios.put(
            `/cucop/api/quot-products/${this.id}`,
            this.quotProduct,
          );
        }
        this.code = result.status;
        if (this.code == 200) {
          setTimeout(() => {
            window.location.replace(
              `/cucop/lists/${this.listId}/quotation/${this.quotProduct.quotationId}`,
            );
          }, 1500);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
    sendFormProduct: async function () {
      this.prodcodecode = 0;
      console.log("QuotProductID: " + this.quotProduct.productId);
      console.log("ProdProductID: " + this.product.productId);
      if (this.validateEmptyProduct()) {
        console.log("No valido Product" + this.product);
        this.prodcodecode = -1;
        return;
      }
      if (isNaN(this.quotProduct.productId || this.product.productId)) {
        try {
          console.log("Añadiendo Product");
          console.log(this.product);
          let result;
          this.product.name = this.productName;
          result = await axios.post("/cucop/api/products", this.product);
          this.prodcode = result.status;
          if (this.prodcode == 200) {
            this.loadProducts();
            this.quotProduct.productId = result.data.id;
          }
        } catch (ex) {
          this.code = ex.response.status;
        }
      } else {
        try {
          console.log("Actualizando Product");
          console.log(this.product);
          let result;
          this.product.name = this.productName;
          result = await axios.put(
            `/cucop/api/products/${this.product.productId}`,
            this.product,
          );
          this.prodcode = result.status;
          if (this.prodcode == 200) {
            this.loadProducts();
          }
        } catch (ex) {
          this.code = ex.response.status;
        }
      }
    },
    filteringProducts: function () {
      let newproddata = [];
      if (this.productName) {
        const seachtext = this.productName.toLowerCase();
        newproddata = this.productsData.filter((product) => {
          return (
            (product.name && product.name.toLowerCase().includes(seachtext)) ||
            (product.description &&
              product.description.toLowerCase().includes(seachtext))
          );
        });
      } else {
        newproddata = this.productsData;
      }
      return [...newproddata];
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
      if (type == "productName") {
        if (!item) {
          this.product.productId = "";
          this.productName = "";
          this.product.name = "";
          this.product.cucopId = "";
          this.cucop.clavecucop = "";
          this.cucopelement.clavecucop = "";
          this.product.description = "";
          return;
        }
        this.quotProduct.productId = item.productId;
        this.product.productId = item.productId;
        await this.loadProduct();
      }
    },
    searchFieldShowList: function (type) {
      if (type == "productName") {
        this.showSearchProductFieldData = true;
      }
    },
    searchFieldHideList: function (type) {
      if (type == "productName") {
        this.showSearchProductFieldData = false;
      }
    },
    searchFieldIsShowed: function (type) {
      if (type == "productName") {
        return this.showSearchProductFieldData;
      }
    },
    //Metodos Para el modal
    filteringCucop: function () {
      if (!this.cucopDesc || this.cucopDesc.trim() === "") {
        this.totalPages = Math.ceil(this.cucopdata.length / this.itemsPerPage);
        return this.cucopdata;
      }

      let newdata = this.cucopdata.filter((x) => {
        const searchText = this.cucopDesc.toLowerCase();
        return (
          x.descripcion.toLowerCase().includes(searchText) ||
          x.unidaddemedida.toLowerCase().includes(searchText) ||
          x.tipodecontratacion.toLowerCase().includes(searchText) ||
          x.descpartidaespecifica.toLowerCase().includes(searchText) ||
          x.descpartidagenerica.toLowerCase().includes(searchText) ||
          x.descconcepto.toLowerCase().includes(searchText) ||
          x.desccapitulo.toLowerCase().includes(searchText)
        );
      });

      if (newdata.length == 0) {
        this.totalPages = 0;
      } else {
        this.totalPages = Math.ceil(newdata.length / this.itemsPerPage);
        this.currentPage = 1;
      }
      return newdata;
    },
    selectCUCOP: function () {
      $("#modalSelect").modal("toggle");
    },
    selectRow: async function (clavecucop) {
      this.product.cucopId = clavecucop;
      await this.loadCucop();
      $("#modalSelect").removeClass("show").modal("hide");
    },
    selectCapitulo: async function () {
      this.currentPage = 1;
      if (this.capitulo == 0) {
        this.conceptos = [];
        this.concepto = "0";
        this.genericas = [];
        this.generica = "0";
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];
        await this.loadCucops();
      } else {
        this.conceptos = [];
        this.concepto = "0";
        this.genericas = [];
        this.generica = "0";
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];

        try {
          const request = await axios.get(
            `/cucop/api/cucop/conceptos/${this.capitulo}`,
          );
          this.conceptos = request.data.cucop;
          this.cucopdata = request.data.cucopdata;
        } catch (ex) {
          console.log(ex);
          this.conceptos = [];
        }
      }
    },
    selectConcepto: async function () {
      this.currentPage = 1;
      if (this.concepto == 0) {
        this.genericas = [];
        this.generica = "0";
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];
        await this.selectCapitulo();
      } else {
        this.genericas = [];
        this.generica = "0";
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];

        try {
          const request = await axios.get(
            `/cucop/api/cucop/genericas/${this.concepto}`,
          );
          this.genericas = request.data.cucop;
          this.cucopdata = request.data.cucopdata;
        } catch (ex) {
          console.log(ex);
          this.genericas = [];
        }
      }
    },
    selectPartidaGenerica: async function () {
      this.currentPage = 1;
      if (this.generica == 0) {
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];
        await this.selectConcepto();
      } else {
        this.especificas = [];
        this.especifica = "0";
        this.cucopdata = [];

        try {
          const request = await axios.get(
            `/cucop/api/cucop/especificas/${this.generica}`,
          );
          this.especificas = request.data.cucop;
          this.cucopdata = request.data.cucopdata;
        } catch (ex) {
          console.log(ex);
          this.especificas = [];
        }
      }
    },
    selectPartidaEspecifica: async function () {
      this.currentPage = 1;
      if (this.especifica == 0) {
        this.cucopdata = [];
        await this.selectPartidaGenerica();
      } else {
        this.cucopdata = [];

        try {
          const request = await axios.get(
            `/cucop/api/cucop/registros/${this.especifica}`,
          );
          this.cucopdata = request.data.cucop;
        } catch (ex) {
          console.log(ex);
          this.cucopdata = [];
        }
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handlePageInput() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      } else if (this.currentPage < 1) {
        this.currentPage = 1;
      }
    },
    validatePage() {
      if (isNaN(this.currentPage) || this.currentPage < 1) {
        this.currentPage = 1;
      } else if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    highlight(text, search) {
      if (!search) return text;
      return text
        .toString()
        .replace(new RegExp(search, "gi"), (match) => `<mark>${match}</mark>`);
    },
  },
}).mount("#app");
