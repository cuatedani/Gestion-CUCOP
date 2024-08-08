/* eslint-disable no-undef */
const { createApp } = Vue;

createApp({
  data() {
    return {
      listId: 0,
      quotationId: 0,
      code: 0,
      isLoading: false,
      processButtonText: "Cargar",
      errorMessage: "",
      successMessage: "",
      file: null,
      fileUrl: "",
      pdfUrl: "",
    };
  },
  mounted() {
    const href = window.location.href;
    const lid = href.split("/")[5];
    try {
      this.listId = parseInt(lid);
    } catch (ex) {
      this.listId = 0;
    }

    const qid = href.split("/")[7];
    try {
      this.quotationId = parseInt(qid);
    } catch (ex) {
      this.quotationId = 0;
    }

    this.loadPdf();
  },
  methods: {
    async loadPdf() {
      try {
        const result = await axios.get(
          `/cucop/api/medias/quotations/${this.quotationId}`,
        );

        if (result.status === 200) {
          const mediaId = result.data.media.mediaId;

          const response = await axios.get(`/cucop/api/medias/${mediaId}`, {
            responseType: "blob",
          });

          this.pdfUrl = URL.createObjectURL(response.data);
        } else {
          this.pdfUrl = null;
        }
      } catch (ex) {
        console.log(ex);
        this.pdfUrl = null;
      }
    },
    handleFileUpload(event) {
      this.code = 0;
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.fileUrl = URL.createObjectURL(file);
      }
    },
    processFile() {
      if (!this.file) {
        this.code = 404;
        this.errorMessage = "Por favor, sube un archivo antes de cargarlo.";
        return;
      }
      this.sendFile();
    },
    async sendFile() {
      try {
        this.isLoading = true;
        const formData = new FormData();
        formData.append("media", this.file);

        const result = await fetch(
          `/cucop/api/medias/quotations/${this.quotationId}/`,
          {
            method: "POST",
            body: formData,
          },
        );

        this.code = result.status;
        if (this.code === 200) {
          this.isLoading = false;
          this.successMessage = "Archivo cargado exitosamente";
          this.loadPdf();
        } else {
          throw new Error("Error en la carga del archivo");
        }
      } catch (ex) {
        this.isLoading = false;
        this.code = 500;
        this.errorMessage = ex.message;
      }
    },
  },
}).mount("#app");
