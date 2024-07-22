/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      listId: 0,
      id: 0,
      quotProduct: {
        quotationId: 0,
        productId: 0,
        quantity: 0,
        price: 0,
        details: "",
        active: true,
      },
      code: 0,
      prodcode: 0,
      log: "",
      errorMessage: "",
      successMessage: "",
      fileContent: [],
      showLogs: false,
    };
  },
  mounted() {
    const href = window.location.href;
    const lid = href.split("/")[5];
    console.log("Esta es la lista: ", lid);
    try {
      this.listId = parseInt(lid);
    } catch (ex) {
      this.listId = 0;
    }

    const qid = href.split("/")[7];
    console.log("Esta es la cotización: ", qid);
    try {
      this.quotProduct.quotationId = parseInt(qid);
    } catch (ex) {
      this.quotProduct.quotationId = 0;
    }
  },
  computed: {
    LogsButtonText() {
      return this.showLogs ? "Ocultar Registros" : "Mostrar Registros";
    },
  },

  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.log += "Archivo cargado.\n";
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const extension = file.name.split(".").pop().toLowerCase();

          if (extension === "csv") {
            this.log += "Archivo CSV detectado.\n";
            this.verifyFileContent(content);
          } else if (extension === "xlsx" || extension === "xls") {
            this.log += "Transformando archivo a CSV.\n";
            const workbook = XLSX.read(content, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const csvContent = XLSX.utils.sheet_to_csv(sheet);
            this.verifyFileContent(csvContent);
          } else {
            this.errorMessage =
              "Formato de archivo no soportado. Por favor sube un archivo CSV, XLSX o XLS.";
            this.log += "Formato de archivo no soportado.\n";
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    verifyFileContent(content) {
      this.log += "Analizando campos del archivo.\n";
      const requiredFields = [
        "id",
        "productId",
        "quantity",
        "price",
        "details",
      ];
      const lines = content.split("\n");
      const headers = lines[0].split(",");

      const missingFields = requiredFields.filter(
        (field) => !headers.includes(field),
      );
      if (missingFields.length > 0) {
        this.code = 111;
        this.errorMessage = `Faltan los siguientes campos requeridos: ${missingFields.join(
          ", ",
        )}`;
        this.successMessage = "";
        this.log += `Faltan los siguientes campos requeridos: ${missingFields.join(
          ", ",
        )}.\n`;
      } else {
        this.successMessage =
          "El archivo contiene todos los campos requeridos.";
        this.errorMessage = "";
        this.log += "El archivo contiene todos los campos requeridos.\n";
        this.fileContent = lines.slice(1); // Almacena las filas del archivo (sin los encabezados)
      }
    },
    async processFile() {
      try {
        let c = 1;
        for (const line of this.fileContent) {
          try {
            const values = line.split(",");
            if (values[1] == "" || values[2] == "" || values[3] == "") {
              this.log += `Fila No.${c} vacía o incompleta, omitiendo...\n`;
              c++;
              continue;
            }
            this.id = values[0];
            this.quotProduct.productId = values[1];
            this.quotProduct.quantity = values[2];
            this.quotProduct.price = values[3];
            this.quotProduct.details = values[4];
            await setTimeout(500);
            this.log += `Revisando fila No.${c}...\n`;
            await setTimeout(500);
            let result;
            if (this.id == 0) {
              this.log += "Añadiendo producto cotizado...\n";
              await setTimeout(500);
              result = await axios.post(
                "/cucop/api/quot-products",
                this.quotProduct,
              );
              this.prodcode = result.status;
              if (this.prodcode == 200) {
                this.log += `Producto cotizado añadido.\n`;
              } else {
                this.log += `Error al añadir producto cotizado.\n`;
              }
            } else {
              this.log += "Editando producto de cotizado...\n";
              await setTimeout(500);
              result = await axios.put(
                `/cucop/api/quot-products/${this.id}`,
                this.quotProduct,
              );
              this.prodcode = result.status;
              if (this.prodcode == 200) {
                this.log += `Producto cotizado editado.\n`;
              } else {
                this.log += `Error al editar producto cotizado.\n`;
              }
            }
          } catch (ex) {
            console.log(ex);
            this.log += `Error al procesar la fila No.${c}.\n`;
          }
          c++;
        }
        this.log += "Archivo procesado exitosamente.\n";
        await setTimeout(() => {
          window.location.replace(
            `/cucop/lists/${this.listId}/quotation/${this.quotProduct.quotationId}`,
          );
        }, 1500);
      } catch (ex) {
        console.log(ex);
        this.log += "Error al procesar el archivo.\n";
      }
    },
    toggleLogs() {
      this.showLogs = !this.showLogs;
    },
  },
}).mount("#app");
