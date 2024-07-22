/* eslint-disable no-undef */
const { createApp } = Vue;
createApp({
  data() {
    return {
      id: 0,
      cucop: {
        clavecucop: 0,
        descripcion: "",
        unidaddemedida: "",
        tipodecontratacion: "",
        partidaespecifica: 0,
        descpartidaespecifica: "",
        partidagenerica: 0,
        descpartidagenerica: "",
        concepto: 0,
        descconcepto: "",
        capitulo: 0,
        desccapitulo: "",
      },
      code: 0,
      cucopcode: 0,
      log: "",
      errorMessage: "",
      successMessage: "",
      fileContent: [],
      showLogs: false,
    };
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
      this.log += "Analizando campos del archivo...\n";
      const requiredFields = [
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

      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields;
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

            this.fileContent = results.data.map((row) =>
              requiredFields.map((field) => row[field]),
            );
          }
        },
        error: (error) => {
          this.errorMessage = "Error al analizar el archivo CSV.";
          this.log += `Error al analizar el archivo CSV: ${error.message}\n`;
        },
      });
    },
    async processFile() {
      try {
        let c = 1;
        for (const line of this.fileContent) {
          try {
            if (!Array.isArray(line)) {
              this.log += `Fila No.${c} no es un arreglo, omitiendo...\n`;
              c++;
              continue;
            }

            const values = line;

            if (values.some((field) => !field)) {
              this.log += `Fila No.${c} vacía o incompleta, omitiendo...\n`;
              c++;
              continue;
            }

            this.cucop.clavecucop = values[0];
            this.cucop.descripcion = values[1];
            this.cucop.unidaddemedida = values[2];
            this.cucop.tipodecontratacion = values[3];
            this.cucop.partidaespecifica = values[4];
            this.cucop.descpartidaespecifica = values[5];
            this.cucop.partidagenerica = values[6];
            this.cucop.descpartidagenerica = values[7];
            this.cucop.concepto = values[8];
            this.cucop.descconcepto = values[9];
            this.cucop.capitulo = values[10];
            this.cucop.desccapitulo = values[11];

            this.log += `Revisando fila No.${c}...\n`;
            let result;
            result = await axios.get(
              `/cucop/api/cucop/load/${this.cucop.clavecucop}`,
            );
            this.id = result.data.id;
            if (this.id == 0) {
              this.log += "Añadiendo registro CUCoP...\n";
              result = await axios.post("/cucop/api/cucop", this.cucop);
              this.cucopcode = result.status;
              if (this.cucopcode == 200) {
                this.log += `Registro CUCoP añadido.\n`;
              } else {
                this.log += `Error al añadir registro CUCoP.\n`;
              }
            } else {
              this.log += "Editando registro CUCoP...\n";
              result = await axios.put(
                `/cucop/api/cucop/${this.id}`,
                this.cucop,
              );
              this.cucopcode = result.status;
              if (this.cucopcode == 200) {
                this.log += `registro CUCoP editado.\n`;
              } else {
                this.log += `Error al editar registro CUCoP.\n`;
              }
            }
          } catch (ex) {
            console.log(ex);
            this.log += `Error al procesar la fila No.${c}.\n`;
          }
          c++;
        }
        this.code = 200;
        this.log += "Archivo procesado exitosamente.\n";
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
