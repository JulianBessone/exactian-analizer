const puppeteer = require ('puppeteer');
const { getDocContra } = require('./DataChecker/docContra');
const { getDocEmple } = require('./DataChecker/docEmple');
const { getDocVehi } = require('./DataChecker/docVehi');
const { logginExactian, navegationMenu } = require('./ExactianInterface/ExactianInterface');
const { notifyDocEmpleProblems } = require('./Notifications/notificationsDocu');
const { chargeData } = require('./ChargeData/ChargeData');


//La funcion crea una instancia de puppeteer y recibe el cliente de WhatsApp, esto con el fin de enviar mensajes a un numero en especifico para avisar de que hay docu vencida o pendiente

const exactian = async (client, groupID) =>{
    /* ABRIMOS EL NAVEGADOR */

    const browser = await puppeteer.launch({
        headless: false,
        //args: [ '--proxy-server=178.169.139.180:8080']
    });
    const page = await browser.newPage();
    await page.goto('https://ganfenglatam.exactian.solutions'); //Accedo a la web de exactian Ganfen

    logginExactian(page) //Funcion para ingresar a la app.

    // Esperar a que la nueva página se cargue completamente
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    navegationMenu(page, 'generalDocu') //Funcion para navegar en el menu y aceder a la documentación detallada generalmente
    

    // Esperar a que la nueva página se cargue completamente
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    //TABLA DE INFORMACIÓN
    /*
    await page.waitForSelector('table#principal table table table tr')
    await page.waitForTimeout(2000)
    console.log('*************************/ /*INFORMACIÓN DESCARGADA /****************************')
    const table = await page.$$('table#principal table table table tr td div table')
    const tableDocContra = table[1]
    const tableDocEmple = table[2]
    const tableDocVehi = table[3]
    */
    //const docInfoContra = await getDocContra(tableDocContra, page)
    //const docInfoEmple = await getDocEmple(tableDocEmple,page)
    //const docInfoVehi = await getDocVehi(tableDocVehi, page)

    //notifyDocEmpleProblems(client, groupID, docInfoEmple)

    navegationMenu(page, 'presentarDocu') //Funcion para navegar en el menu y acceder al apartado de cargar documentacion
    chargeData(page, '202309', 'vehiculo')


    console.log('**** TAREA FINALIZADA :D  ****')
    //await browser.close();
}

module.exports = {
    exactian
};