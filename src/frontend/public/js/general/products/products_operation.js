/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: "",
      product: {
        cucopId: "",
        name: "",
        description: "",
        active: true,
      },
      cucop: [],
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
      cucopDesc: "",
      capitulo: "0",
      capitulos: [],
      concepto: "0",
      conceptos: [],
      generica: "0",
      genericas: [],
      especifica: "0",
      especificas: [],
      data: [],
      cucopdata: [],
      currentPage: 1,
      itemsPerPage: 10,
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
      const request = await axios.get(`/cucop/api/cucop`);
      this.cucopdata = request.data.cucop;
    } catch (ex) {
      console.log(ex);
      this.cucopdata = [];
    }

    try {
      const request = await axios.get("/cucop/api/cucop/chapters");
      this.capitulos = request.data.categorias;
    } catch (ex) {
      console.log(ex);
      this.capitulos = [];
    }

    if (!isNaN(this.id)) await this.loadProduct();
  },
  computed: {
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
    loadProduct: async function () {
      try {
        const request = await axios.get(`/cucop/api/products/${this.id}`);
        this.product = request.data.product;
        this.product.active = this.product.active == 1;
        await this.loadCucop();
      } catch (ex) {
        console.log(ex);
        this.data = [];
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
          setTimeout(() => {
            window.location.replace(`/cucop/products`);
          }, 1500);
        }
      } catch (ex) {
        this.code = ex.response.status;
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
          const requestcat = await axios.get(
            `/cucop/api/cucop/concepts/${this.capitulo}`,
          );
          const requestdata = await axios.get(`/cucop/api/cucop`, {
            params: {
              capitulo: this.capitulo,
            },
          });
          this.conceptos = requestcat.data.categorias;
          this.cucopdata = requestdata.data.cucop;
        } catch (ex) {
          console.log(ex);
          this.conceptos = [];
          this.cucopdata = [];
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
          const requestcat = await axios.get(
            `/cucop/api/cucop/generics/${this.concepto}`,
          );
          const requestdata = await axios.get(`/cucop/api/cucop`, {
            params: { concepto: this.concepto },
          });
          this.genericas = requestcat.data.categorias;
          this.cucopdata = requestdata.data.cucop;
        } catch (ex) {
          console.log(ex);
          this.genericas = [];
          this.cucopdata = [];
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
          const requestcat = await axios.get(
            `/cucop/api/cucop/specifics/${this.generica}`,
          );
          const requestdata = await axios.get(`/cucop/api/cucop`, {
            params: { partidagenerica: this.generica },
          });
          this.especificas = requestcat.data.categorias;
          this.cucopdata = requestdata.data.cucop;
        } catch (ex) {
          console.log(ex);
          this.especificas = [];
          this.cucopdata = [];
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
          const request = await axios.get(`/cucop/api/cucop`, {
            params: { partidaespecifica: this.especifica },
          });
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
