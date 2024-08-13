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
  },
  methods: {
    handleFileUpload(event) {
      this.code = 0;
      const files = event.target.files;
      if (files.length > 0) {
        this.file = files;
        this.fileUrl = Array.from(files).map((file) =>
          URL.createObjectURL(file),
        );
      }
    },
    processFile() {
      if (!this.file || this.file.length === 0) {
        this.code = 404;
        this.errorMessage =
          "Por favor, sube al menos un archivo antes de cargarlo.";
        return;
      }
      this.sendFile();
    },
    async sendFile() {
      try {
        this.isLoading = true;
        const formData = new FormData();

        Array.from(this.file).forEach((file) => {
          formData.append("media", file);
        });

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
          this.successMessage = "Archivos cargados exitosamente";
          setTimeout(() => {
            window.location.replace(
              `/cucop/lists/${this.listId}/quotation/${this.quotationId}`,
            );
          }, 1500);
        } else {
          throw new Error("Error en la carga de archivos");
        }
      } catch (ex) {
        this.isLoading = false;
        this.code = 500;
        this.errorMessage = ex.message;
      }
    },
  },
}).mount("#app");
