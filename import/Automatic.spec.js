// @ts-check
const { test, expect } = require('@playwright/test');
const axios = require('axios');
const https = require('https');

// Crear un agente HTTPS que ignore errores de certificados SSL
const agent = new https.Agent({  
  rejectUnauthorized: false
});

const SitioWeb = "https://;
const apiURL = 'https://';

// Reemplaza con el ID de la cotización que quieras usar
const quotationId = '1';
let quotation ={};
let quotationProducts = [];
const RFC = "56576";
const fecha = addDaysToCurrentDate(3);

function addDaysToCurrentDate(daysToAdd) {
  // Obtener la fecha actual
  const today = new Date();

  // Agregar los días
  today.setDate(today.getDate() + daysToAdd);

  // Formatear la fecha en dd/mm/yyyy
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}
  
test.beforeAll('tryGetData', async () => {
  try {
    // Realizar la primera solicitud GET
    const response1 = await axios.get(`${apiURL}/api/quotationProducts/`, {
      params: { quotationId: quotationId },
      httpsAgent: agent
    });

    // Verificar que el estado de la respuesta sea 200
    expect(response1.status).toBe(200);

    // Filtrar productos activos
    quotationProducts = response1.data.quotproducts.filter(quotProd => quotProd.active);

    // Realizar la segunda solicitud GET
    const response2 = await axios.get(`${apiURL}/api/quotations/${quotationId}`, {
      httpsAgent: agent
    });

    // Verificar que el estado de la respuesta sea 200
    expect(response2.status).toBe(200);

    // Obtener los datos de la respuesta
    quotation = response2.data.quotation;
    // Aquí puedes agregar aserciones adicionales si es necesario
  } catch (error) {
    console.error('Error fetching data:', error);
    // Opcional: Puedes fallar la prueba si ocurre un error
    expect(error).toBeNull();
  }
}
);

test('tryLoadData', async ({ page }) => {

  //Ir a la pagina de las solicidudes
  await page.goto(SitioWeb);

  // Crear nueva solicitud
  const solicButton = page.locator('//html/body/div[2]/div/div/section/div[2]/div/div[2]/div/div/div[1]/button');
  await solicButton.click();
  
  //Rellenar Datos de Cotización
  //Tipo de Solicitud
  await page.selectOption('#tipoSolicitud', 'N');
  //Tipo de Moneda
  await page.selectOption('#tipoMoneda', 'P');
  //Tratamiendo
  await page.selectOption('#tipoTratamiento', 'N');
  //Tipo de Compra
  await page.selectOption('#tipoCompra', 'C');
  //Justificación
  await page.fill('#comentarios', quotation.description);
  //Seleccionar Solicitante
  const showSolicitante = page.locator('//*[@id="usuario-modal-button"]');
  await showSolicitante.click();
  await page.waitForTimeout(1000);
  const buttonSolicitante = page.locator('//*[@id="gridUsuarios"]/tbody/tr[1]/td[1]/div/button');
  await page.waitForTimeout(1000);
  await buttonSolicitante.click();
  await page.waitForTimeout(1000);

  //Seleccionar proveedor
  const showProveedor = page.locator('//*[@id="proveedor-container"]/div/div[2]/div/div[1]/div[1]/div/span[2]/button');
  await showProveedor.click();
  await page.waitForTimeout(1000);
  await page.fill('#filtroRFC', RFC);
  await page.waitForTimeout(1000);
  const buttonProveedor = page.locator('//*[@id="gridProveedores"]/tbody/tr[1]/td[1]/div/button');
  await buttonProveedor.click();
  await page.waitForTimeout(1000);

  //Seleccionar Cuenta
  const showCuenta = page.locator('//*[@id="cuenta-modal-button"]');
  await showCuenta.click();
  await page.waitForTimeout(1000);
  const buttonCuenta = page.locator('//*[@id="gridCuentas"]/tbody/tr[1]/td[1]/div/button');
  await buttonCuenta.click();
  await page.waitForTimeout(1000);

  //Seleccionar Fecha Estimada
  const fechaInput = page.locator('#fechaEstimada');
  await fechaInput.fill(fecha);
  await fechaInput.press('Enter');
  await page.waitForTimeout(1000);

  for(const quot of quotationProducts){
  //Inicia registro de articulo

  //Abrir Modal
  const showForm = await page.locator('//*[@id="button-new-detalle"]');
  await showForm.waitFor({ state: 'visible' });
  await showForm.click();

  //Añadir Productos
    const Form =  await page.locator('//*[@id="elaborador-container"]/div');
    Form.waitFor({state: 'visible'});

    //      Insertando valores a los campos
    await page.fill('#input-serie', quot.product.serialNumber.toString());
    await page.fill('#input-item', quot.product.itemNumber.toString());
    await page.fill('#input-cantidad', quot.quantity.toString());
    await page.fill('#input-precio-unitario', quot.price.toString());
    await page.fill('#input-descuento', quot.discount.toString());
    await page.fill('#input-montoiva', quot.amountIVA.toString());
    await page.fill('#input-descripcion', quot.product.description.toString());
  
     
    //          seleccionando valores de los select estaticos
    
    if(quot.IVA == 0){
      await page.selectOption('#input-ivaaplica', '0.0');
    }else{
      await page.selectOption('#input-ivaaplica', quot.IVA.toString());
    }
    
    if(quot.ISR == 0){
      await page.selectOption('#input-israplica', '0.0');
    }else{
      await page.selectOption('#input-israplica', quot.ISR.toString());
    }
  
    
    //          Seleccion de Unidad
    
  
    // Hacer clic en el botón para desplegar las opciones de unidad
    // Espera a que el botón esté visible
  const unidadbutton = await page.locator('//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[4]/div[3]/div/div/button');
  await unidadbutton.waitFor({ state: 'visible' });

  // Si el botón está cubierto o no es visible, intenta desplazarlo en la vista
  await unidadbutton.scrollIntoViewIfNeeded();

  // Haz clic en el botón
  await unidadbutton.click();

    // Buscar el select usando XPath y seleccionar la opción que contenga data.product.denomination
    const unidadselect = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[4]/div[3]/div/div/div/ul/li[.//span[contains(text(),'${quot.product.denomination}')]]`).first();
    await unidadselect.click({force:true});  
    
    //     Seleccion de partida
    
  
    // Hacer clic en el botón para desplegar las opciones de partida
    const partidabutton = page.locator('//*[@id="div-input-subcuenta"]/div/button');
    await partidabutton.waitFor({ state: 'visible' });
    await partidabutton.click();

    // Buscar el elemento de la lista
    const partidalistItem = page.locator(`//*[@id="div-input-subcuenta"]/div/div/ul/li[.//span[contains(text(), '${quot.product.cucop.partidaespecifica}')]]`).first();
    
    // Espera a que el elemento sea visible y en el viewport
     await partidalistItem.waitFor({ state: 'visible' });
    // Realizar el clic forzado
    await partidalistItem.click({ force: true });
    
    //      Seleccion de Marca
    
  
    // Hacer clic en el botón para desplegar las opciones
    const marcaButton = page.locator('//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[2]/div/div/button');
    await marcaButton.click();
  
    // Esperar a que el menú esté visible
    await page.waitForTimeout(1000);
  
    try {
    // Intentar encontrar la marca en el tiempo especificado
    const marcaListItem = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[2]/div/div/div/ul/li[.//span[contains(text(), '${quot.product.brand}')]]`).first();
    
    await marcaListItem.waitFor({ state: 'visible', timeout: 5000 });
    await marcaListItem.click();
  
    } catch (error) {
      // Si ocurre un error (como un timeout), seleccionar el elemento por defecto
      const alternativeMarcaItem = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[2]/div/div/div/ul/li[.//span[text()='-']]`).first();
  
       await alternativeMarcaItem.waitFor({ state: 'visible', timeout: 5000 });
       await alternativeMarcaItem.click();
    }
  
    
    //       Seleccion de Modelo
  
  
    // Hacer clic en el botón para desplegar las opciones
    const modelobutton = page.locator('//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[3]/div/div/button');
    await modelobutton.click();
  
    // Esperar a que el menú esté visible
    await page.waitForTimeout(1000);
  
    try {
      // Intentar encontrar el modelo en el tiempo especificado
      const modelolistItem = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[3]/div/div/div/ul/li[.//span[contains(text(), '${quot.product.model}')]]`).first();
  
      await modelolistItem.waitFor({ state: 'visible', timeout: 5000 });
      await modelolistItem.click();
    } catch (error) {
      // Si ocurre un error (como un timeout), seleccionar el elemento por defecto
      const alternativeModeloItem = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[3]/div/div/div/ul/li[.//span[text()='-']]`).first();
      await alternativeModeloItem.waitFor({ state: 'visible', timeout: 5000 }); // Sin timeout para el elemento por defecto
      await alternativeModeloItem.click();
    }
  
    //          Rubro Conacyt

     // Hacer clic en el botón para desplegar las opciones de partida
     const rubroButton = page.locator('//*[@id="div-rubro-conacyt"]/div/div/button');
     await rubroButton.click();
 
     // Esperar a que el menú esté visible
     await page.waitForTimeout(1000);
 
     // Esperar explícitamente a que el elemento sea visible
     const rubroListItem = page.locator(`//*[@id="div-rubro-conacyt"]/div/div/div/ul/li[2]`).first();
     await rubroListItem.click();



    //          Selección de Partidas
  
    // Hacer clic en el botón para desplegar las opciones de partida
    const articuloButton = page.locator('//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[1]/div/div/button');
    await articuloButton.click();

    // Esperar a que el menú esté visible
    await page.waitForTimeout(3000);

    // Esperar explícitamente a que el elemento sea visible
    const articuloListItem = page.locator(`//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[3]/div[1]/div/div/div/ul/li[.//span[contains(text(), '${quot.product.cucop.clavecucop}')]]`).first();
    await articuloListItem.click();

    //guardando articulo
    const sendForm = page.locator('//*[@id="button-guardar-detalle-abas"]')
    await sendForm.click();

    await page.waitForTimeout(2000);

    //cerrando modal
    const closeModal = page.locator('//*[@id="forma-registro-abastecimiento"]/div[2]/div/div[2]/div[8]/button[1]')
    await closeModal.click();

    await page.waitForTimeout(1000);

    // Termina registro de articulo
  }

    //guardando cotización
    //*[@id="guardarSA"]
});