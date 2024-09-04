/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      listId: 0,
      quotationId: 0,
      code: 0,
      logs: [],
      isLoading: false,
      processButtonText: "Cargar",
      errorMessage: "",
      successMessage: "",
      quotProducts: [],
      file: null,
      verified: false,
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
  computed: {
    loadQuotProducts() {
      return this.quotProducts;
    },
    loadLogs() {
      return this.logs.reverse();
    },
  },

  methods: {
    handleFileUpload(event) {
      this.code = 0;
      this.quotProducts = [];
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.verified = false;
        this.logs.push({
          time: new Date().toISOString(),
          type: "info",
          message: "Archivo cargado",
        });
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          const extension = file.name.split(".").pop().toLowerCase();

          if (extension === "csv") {
            this.logs.push({
              time: new Date().toISOString(),
              type: "info",
              message: "Archivo CSV detectado",
            });
            this.verifyFileContent(content);
          } else if (extension === "xlsx" || extension === "xls") {
            this.logs.push({
              time: new Date().toISOString(),
              type: "info",
              message: "Transformando archivo a CSV",
            });
            const workbook = XLSX.read(content, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const csvContent = XLSX.utils.sheet_to_csv(sheet);
            this.verifyFileContent(csvContent);
          } else {
            this.code = 204;
            this.errorMessage =
              "Formato de archivo no soportado. Por favor sube un archivo CSV, XLSX o XLS.";
            this.logs.push({
              time: new Date().toISOString(),
              type: "error",
              message: "Formato de archivo no soportado",
            });
          }
        };
        reader.readAsBinaryString(file);
      }
    },

    parseCSVLine(line) {
      const fields = [];
      let field = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          fields.push(field);
          field = "";
        } else {
          field += char;
        }
      }

      fields.push(field);

      return fields;
    },
    verifyFileContent(content) {
      this.logs.push({
        time: new Date().toISOString(),
        type: "info",
        message: "Analizando campos del archivo",
      });
      const requiredFields = [
        "CUCoP",
        "Producto",
        "Marca",
        "Modelo",
        "Unidad",
        "Descripción",
        "Cantidad",
        "Precio",
        "Descuento",
        "IVA",
        "ISR",
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
        this.logs.push({
          time: new Date().toISOString(),
          type: "error",
          message: `Faltan los siguientes campos requeridos: ${missingFields.join(
            ", ",
          )}.`,
        });
        this.verified = false;
      } else {
        this.errorMessage = "";
        this.logs.push({
          time: new Date().toISOString(),
          type: "success",
          message: "El archivo contiene todos los campos requeridos",
        });
        this.quotProducts = lines
          .slice(1)
          .map((line) => {
            const [
              CUCoP,
              Producto,
              Marca,
              Modelo,
              Unidad,
              Descripción,
              Cantidad,
              Precio,
              Descuento,
              IVA,
              ISR,
            ] = this.parseCSVLine(line);
            return {
              CUCoP,
              Producto,
              Marca,
              Modelo,
              Unidad,
              Descripción,
              Cantidad,
              Precio,
              Descuento,
              IVA,
              ISR,
            };
          })
          .filter(
            (product) =>
              product.Producto &&
              product.Cantidad &&
              product.Precio &&
              product.Descripción,
          );
        this.verified = true;
      }
    },
    async SendFile() {
      try {
        const formData = new FormData();
        const filteredProducts = this.quotProducts.filter(
          (product) => product.Producto && product.Cantidad && product.Precio,
        );
        const csvContent = [
          "CUCoP, Producto, Marca, Modelo, Unidad, Descripción, Cantidad, Precio, Descuento, IVA, ISR",
          ...filteredProducts.map(
            (product) =>
              `${product.CUCoP},"${product.Producto}","${product.Marca}","${product.Modelo}","${product.Unidad}","${product.Descripción}",${product.Cantidad},${product.Precio},${product.Descuento},${product.IVA},${product.ISR}`,
          ),
        ].join("\n");

        formData.append(
          "media",
          new Blob([csvContent], { type: "text/csv" }),
          "QuotProducts-Data.csv",
        );

        // Mostrar loader y desactivar botón
        this.isLoading = true;
        this.processButtonText = "Cargando...";

        const result = await axios.post(
          `/cucop/api/medias/quotationProducts/${this.quotationId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        // Esperar 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Terminar loader y activar botón
        this.isLoading = false;
        this.processButtonText = "Cargar";

        this.code = result.status;
        if (this.code == 200) {
          if (result.data.logs) {
            this.logs.push(...result.data.logs);
          }
          this.successMessage = `Archivo Procesado Correctamente.\n`;
          this.logs.push({
            time: new Date().toISOString(),
            type: "success",
            message: "Archivo Procesado Correctamente",
          });
        } else {
          this.logs.push({
            time: new Date().toISOString(),
            type: result.data.type,
            message: result.data.message,
          });
        }
      } catch (ex) {
        console.log(ex);
        this.logs.push({
          time: new Date().toISOString(),
          type: "error",
          message: "Error al Procesar el Archivo",
        });
      }
    },
    toggleLogs() {
      this.showLogs = !this.showLogs;
    },
    processFile() {
      if (!this.file) {
        this.code = 404;
        this.errorMessage = "Por favor, sube un archivo antes de procesarlo.";
        this.log += "Archivo no encontrado.\n";
        return;
      }
      if (!this.verified) {
        this.code = 203;
        this.errorMessage =
          "El archivo no ha sido verificado o no es válido. Por favor, verifica el archivo antes de procesarlo.";
        this.log += "Archivo no verificado o no válido.\n";
        return;
      }
      this.SendFile();
    },
  },
}).mount("#app");
