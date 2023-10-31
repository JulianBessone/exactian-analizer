const logginExactian = async (page) =>{
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
    await page.waitForTimeout(3000)//espero 2 seg asi la web no peta
    const currentURL = await page.url(); // Obtiene la URL actual de la página
    console.log(currentURL)
    if (currentURL === 'https://webcont.exactian.app/ganfenglatam/dashboard') {
        await oldSiteComeBack(page)
        console.log('**********************CAMBIANDO A WEB CONT v1***************************')
    }
}

const oldSiteComeBack = async (page) =>{
    await page.waitForTimeout(2000)
    await page.waitForSelector('button.dropdown-toggle.shadow.user-icon')
    await page.click('button.dropdown-toggle.shadow.user-icon')
    await page.waitForTimeout(2000)
    const changeWebCont = await page.$$('button.btn-user-options')
    const buttonChangeWebCont= changeWebCont[2]
    buttonChangeWebCont.click()
}

const navegationMenu = async (page, destiny) =>{
    // MENU DOCUMENTACIÓN
    //await page.waitForTimeout(5000)
    //await page.waitForSelector('ul.navbar-nav');

    const liDocu = await page.$('li.nav-item:nth-child(4)'); //elemento que selecciona el apartado de DOCUMENTACION
    const ulDocs = await page.$$('ul.list-group a'); //accedo a todos los elementos del MENU DESPLEGABLE DE DOCUMENTACION

    
    switch (destiny) {
        case 'generalDocu':
            //En en menu desplegable
            //const generalDetail = ulDocs[1] //voy a la info general
            //await generalDetail.click(); // le hago click
            await page.goto('https://ganfenglatam.exactian.solutions/webcont/index.php?section=20')//Aqui en vez de hacer click en el menu de navegación hemos resulto que lo mejor seria decirle al navegador que se dirija a esa url
            await page.waitForTimeout(5000)
            console.log('ESTAMOS EN EL MENU DE RESUMEN GENERAL')
            break;
        case 'presentarDocu':
            //En en menu desplegable
            //await presentarDocuLI.click(); // le hago click
            await page.goto('https://ganfenglatam.exactian.solutions/webcontv2/Controllers/WebcontPageController/appRedirect/SUBMISSIONS')
            await page.waitForTimeout(5000)
            console.log('ESTAMOS EN EL MENU DE PRESENTACIONES DE DOCU')
            break;
        default:
            break;
    }
}

module.exports = {
    logginExactian,
    navegationMenu,
    oldSiteComeBack
};