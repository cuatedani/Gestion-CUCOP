/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      code: 0,
      logs: [],
      isLoading: false,
      processButtonText: "Cargar",
      errorMessage: "",
      successMessage: "",
      cucopdata: [],
      file: null,
      verified: false,
      currentPage: 1,
      currentPageLogs: 1,
      itemsPerPage: 20,
    };
  },
  computed: {
    LogsButtonText() {
      return this.showLogs ? "Ocultar Registros" : "Mostrar Registros";
    },
    paginatedCucop() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedResult = this.cucopdata.slice(start, end);
      return paginatedResult;
    },
    paginatedLogs() {
      const start = (this.currentPageLogs - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      const paginatedResult = this.logs.reverse().slice(start, end);
      return paginatedResult;
    },
    totalPages() {
      const totalPages = Math.ceil(this.cucopdata.length / this.itemsPerPage);
      return totalPages;
    },
    totalPagesLogs() {
      const totalPagesLogs = Math.ceil(this.logs.length / this.itemsPerPage);
      return totalPagesLogs;
    },
  },
  methods: {
    handleFileUpload(event) {
      this.code = 0;
      this.cucopdata = [];
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
          inQuotes = !inQuotes; // indica que esta en comillas
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
        "Clave CUCoP",
        "Descripción",
        "Unidad de Medida",
        "Tipo de Contratación",
        "Partida Especifica",
        "Desc Partida Especifica",
        "Partida Generica",
        "Desc Partida Generica",
        "Concepto",
        "Desc Concepto",
        "Capitulo",
        "Desc Capitulo",
      ];

      const alternativeFields = [
        "CLAVE CUCoP",
        "DESCRIPCIÓN",
        "UNIDAD DE MEDIDA (sugerida)",
        "TIPO DE CONTRATACIÓN",
        "PARTIDA ESPECÍFICA",
        "DESC. PARTIDA ESPECÍFICA",
        "PARTIDA GENÉRICA",
        "DESC. PARTIDA GENÉRICA",
        "CONCEPTO",
        "DESC. CONCEPTO",
        "CAPÍTULO",
        "DESC. CAPÍTULO",
      ];

      const lines = content.split("\n");
      let headers = this.parseCSVLine(lines[0]);

      // Revisa si es el formato CUCoP
      const isAlternativeFormat = headers.includes("CLAVE CUCoP +");

      let headerMap = {};
      let columnsToRemove = [];
      let columnsToKeep = [];

      if (isAlternativeFormat) {
        // Columnas a eliminar
        columnsToRemove = [
          "CLAVE CUCoP +",
          "FECHA ALTA CUCOP",
          "FECHA MODIFICACIÓN CUCOP",
        ];

        // Crea el mapa de renombrado
        alternativeFields.forEach((alt, index) => {
          headerMap[alt] = requiredFields[index];
        });

        // Determina qué columnas mantener
        columnsToKeep = headers.map((header) => {
          return !columnsToRemove.includes(header);
        });

        // Aplica la eliminación y renombrado a los headers
        headers = headers
          .filter((_, index) => columnsToKeep[index])
          .map((header) => headerMap[header] || header);
      }

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

        // Process the data
        this.cucopdata = lines
          .slice(1)
          .map((line) => {
            let values = this.parseCSVLine(line);

            if (isAlternativeFormat) {
              // Elimina las columnas no deseadas de los valores
              values = values.filter((_, index) => columnsToKeep[index]);
            }

            const entry = {};
            headers.forEach((header, index) => {
              entry[header] = values[index];
            });

            return {
              clavecucop: entry["Clave CUCoP"],
              descripcion: entry["Descripción"],
              unidaddemedida: entry["Unidad de Medida"],
              tipodecontratacion: entry["Tipo de Contratación"],
              partidaespecifica: entry["Partida Especifica"],
              descpartidaespecifica: entry["Desc Partida Especifica"],
              partidagenerica: entry["Partida Generica"],
              descpartidagenerica: entry["Desc Partida Generica"],
              concepto: entry["Concepto"],
              descconcepto: entry["Desc Concepto"],
              capitulo: entry["Capitulo"],
              desccapitulo: entry["Desc Capitulo"],
            };
          })
          .filter(
            (cucop) =>
              cucop.clavecucop &&
              cucop.descripcion &&
              cucop.partidaespecifica &&
              cucop.partidagenerica &&
              cucop.concepto &&
              cucop.capitulo,
          );

        this.verified = true;
      }
    },
    async processFile() {
      if (!this.file) {
        this.code = 404;
        this.errorMessage = "Por favor, sube un archivo antes de procesarlo.";
        this.logs.push({
          time: new Date().toISOString(),
          type: "error",
          message: "Archivo no encontrado",
        });
        return;
      }
      if (!this.verified) {
        this.code = 203;
        this.errorMessage =
          "El archivo no ha sido verificado o no es válido. Por favor, verifica el archivo antes de procesarlo.";
        this.logs.push({
          time: new Date().toISOString(),
          type: "error",
          message: "Archivo no verificado o no válido",
        });
        return;
      }
      this.SendFile();
    },
    async SendFile() {
      try {
        const formData = new FormData();
        const filteredCucops = this.cucopdata.filter(
          (cucop) =>
            cucop.clavecucop &&
            cucop.descripcion &&
            cucop.partidaespecifica &&
            cucop.partidagenerica &&
            cucop.concepto &&
            cucop.capitulo,
        );
        const csvContent = [
          "Clave CUCoP, Descripción, Unidad de Medida, Tipo de Contratación, Partida Especifica, Desc Partida Especifica, Partida Generica, Desc Partida Generica, Concepto, Desc Concepto, Capitulo, Desc Capitulo",
          ...filteredCucops.map(
            (cucop) =>
              `${cucop.clavecucop},"${cucop.descripcion}",${cucop.unidaddemedida},${cucop.tipodecontratacion},${cucop.partidaespecifica},"${cucop.descpartidaespecifica}",${cucop.partidagenerica},"${cucop.descpartidagenerica}",${cucop.concepto},"${cucop.descconcepto}",${cucop.capitulo},"${cucop.desccapitulo}"`,
          ),
        ].join("\n");

        formData.append(
          "media",
          new Blob([csvContent], { type: "text/csv" }),
          "CUCoP-Data.csv",
        );

        // Mostrar loader y desactivar botón
        this.isLoading = true;
        this.processButtonText = "Cargando...";

        const result = await axios.post(`/cucop/api/medias/cucop/0`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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
          message: "Error al procesar el archivo",
        });
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
    nextPageLogs() {
      if (this.currentPageLogs < this.totalPagesLogs) {
        this.currentPageLogs++;
      }
    },
    prevPageLogs() {
      if (this.currentPageLogs > 1) {
        this.currentPageLogs--;
      }
    },
    handlePageInputLogs() {
      if (this.currentPageLogs > this.totalPagesLogs) {
        this.currentPageLogs = this.totalPagesLogs;
      } else if (this.currentPageLogs < 1) {
        this.currentPageLogs = 1;
      }
    },
    validatePageLogs() {
      if (isNaN(this.currentPageLogs) || this.currentPageLogs < 1) {
        this.currentPageLogs = 1;
      } else if (this.currentPageLogs > this.totalPagesLogs) {
        this.currentPageLogs = this.totalPagesLogs;
      }
    },
  },
}).mount("#app");
