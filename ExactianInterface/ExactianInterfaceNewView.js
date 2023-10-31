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
    //await page.waitForSelector('ul.navbar-nav');

    const liDocu = await page.$('.accordion-item:first-of-type .accordion-button.collapsed'); //elemento que selecciona el apartado de DOCUMENTACION
    if(liDocu){
        await liDocu.click()
        await page.waitForTimeout(2000)
        await page.waitForSelector('button.submenu-sidebar')
        const ulDocs = await page.$$('button.submenu-sidebar'); //accedo a todos los elementos del MENU DESPLEGABLE DE DOCUMENTACION
    
        switch (destiny) {
            case 'generalDocu':
                //En en menu desplegable
                const generalDetail = ulDocs[1] //voy a la info general
                await generalDetail.click(); // le hago click
                // Espera a que el botón esté disponible
                await page.waitForSelector('.btn-secondary-gd.btn.btn-primary');
    
                // Encuentra el botón por su clase y haz clic en él
                await page.click('.btn-secondary-gd.btn.btn-primary');
    
            case 'presentarDocu':
                //En en menu desplegable
                const presentarDocuLI = ulDocs[0] //voy a la info general
                await presentarDocuLI.click(); // le hago click
            
            default:
                break;
        }
    }else{
        return(console.error('HAY UN ERROR EN LA CARGA DEL MENU POR FAVOR SUMA MAS TIMEOUT DE ESPERA'))
    }

}

module.exports = {
    logginExactian,
    navegationMenu
};