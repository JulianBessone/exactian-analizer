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
}

//La idea aquí es que reciba por parametro el destino así va a distintas ubicaciones con la misma fn
const navegationMenu = async (page, destiny) =>{
    // MENU DOCUMENTACIÓN
    //await page.waitForTimeout(5000)
    await page.waitForSelector('ul.navbar-nav');

    const liDocu = await page.$('li.nav-item:nth-child(4)'); //elemento que selecciona el apartado de DOCUMENTACION
    const ulDocs = await page.$$('ul.list-group a'); //accedo a todos los elementos del MENU DESPLEGABLE DE DOCUMENTACION

    switch (destiny) {
        case 'generalDocu':

            await liDocu.click()//Hago click en el menu en la parte de navegación
            //En en menu desplegable
            const generalDetail = ulDocs[1] //voy a la info general
            await generalDetail.click(); // le hago click

        case 'presentarDocu':
            await page.waitForTimeout(5000)
            await liDocu.click()//Hago click en el menu en la parte de navegación
            //En en menu desplegable
            const presentarDocuLI = ulDocs[0] //voy a la info general
            await presentarDocuLI.click(); // le hago click
        
        default:
            break;
    }
}

module.exports = {
    logginExactian,
    navegationMenu
};