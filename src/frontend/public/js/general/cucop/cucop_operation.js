/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      cucop: {
        clavecucop: "",
        descripcion: "",
        unidaddemedida: "",
        tipodecontratacion: "",
        partidaespecifica: "",
        descpartidaespecifica: "",
        partidagenerica: "",
        descpartidagenerica: "",
        concepto: "",
        descconcepto: "",
        capitulo: "",
        desccapitulo: "",
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
    if (!isNaN(this.id)) this.loadCucop();
  },
  methods: {
    loadCucop: async function () {
      try {
        const request = await axios.get(`/cucop/api/cucop/${this.id}`);
        this.cucop = request.data.cucop;
        this.cucop.active = this.cucop.active == 1;
      } catch (ex) {
        console.log(ex);
        this.data = [];
      }
    },
    validateEmpty: function () {
      return (
        !this.cucop.clavecucop ||
        !this.cucop.descripcion ||
        !this.cucop.unidaddemedida ||
        !this.cucop.tipodecontratacion ||
        !this.cucop.partidaespecifica ||
        !this.cucop.descpartidaespecifica ||
        !this.cucop.partidagenerica ||
        !this.cucop.descpartidagenerica ||
        !this.cucop.concepto ||
        !this.cucop.descconcepto ||
        !this.cucop.capitulo ||
        !this.cucop.desccapitulo
      );
    },
    async sendForm() {
      this.code = 0;
      if (this.validateEmpty()) {
        this.code = -1;
        return;
      }
      try {
        let result;
        if (isNaN(this.id)) {
          result = await axios.post("/cucop/api/cucop", this.cucop);
        } else {
          result = await axios.put(`/cucop/api/cucop/${this.id}`, this.cucop);
        }
        this.code = result.status;

        if (this.code == 200) {
          setTimeout(() => {
            this.loadMedias();
            window.location.replace(`/cucop/cucop`);
          }, 1500);
        }
      } catch (ex) {
        this.code = ex.response.status;
      }
    },
  },
}).mount("#app");
