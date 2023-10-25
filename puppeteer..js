const puppeteer = require ('puppeteer');
const { getDocContra } = require('./DataChecker/docContra');
const { getDocEmple } = require('./DataChecker/docEmple');
const { getDocVehi } = require('./DataChecker/docVehi');

(async ()=>{
    /* ABRIMOS EL NAVEGADOR */

    const browser = await puppeteer.launch({
        headless: false,
        //args: [ '--proxy-server=178.169.139.180:8080']
    });
    const page = await browser.newPage();
    await page.goto('https://ganfenglatam.exactian.solutions');

    const botonContratista = await page.$('li#opcionContratista a');

    await botonContratista.click();

    //Credenciales de acceso

    const usuario = '33716427949'
    const pass = 'Grey1472'

    //Inputs
    await page.waitForSelector('input#cuit.form-control')
    await page.waitForSelector('input#password')
    await page.waitForTimeout(2000)

    await page.type('input#cuit.form-control', usuario);
    await page.type('input#password.form-control', pass);

    const passInput = await page.$('input#password.form-control')
    await page.waitForTimeout(2000)//espero 2 seg asi la web no peta
    await passInput.press('Enter'); // presiono la tecla enter e ingreso
    console.log('**********************SESION INICIADA CORRECTAMENTE***************************')

    // MENU DOCUMENTACIÓN
    await page.waitForTimeout(5000)
    await page.waitForSelector('ul.navbar-nav');
    const liDocu = await page.$('li.nav-item:nth-child(4)');
    await liDocu.click()//Hago click en el menu en la parte de navegación

    //En en menu desplegable
    const ulDocs = await page.$$('ul.list-group a'); //accedo a todos los elementos 
    const generalDetail = ulDocs[1] //voy a la info general
    await generalDetail.click() // le hago click

    // Esperar a que la nueva página se cargue completamente
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    //TABLA DE INFORMACIÓN
    await page.waitForSelector('table#principal table table table tr')
    await page.waitForTimeout(2000)
    console.log('*************************/ INFORMACIÓN DESCARGADA /****************************')
    const table = await page.$$('table#principal table table table tr td div table')
    const tableDocContra = table[1]
    const tableDocEmple = table[2]
    const tableDocVehi = table[3]

    const docInfoContra = await getDocContra(tableDocContra, page)
    const docIngoEmple = await getDocEmple(tableDocEmple,page)
    const docInfoVehi = await getDocVehi(tableDocVehi, page)

    
    console.log('**** TAREA FINALIZADA :D  ****')
    await browser.close();
})()