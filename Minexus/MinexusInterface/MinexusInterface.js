const logginMinexus = async (page, account) =>{
    //Credenciales de acceso

    const usuario = account.id || '33716427949'
    const pass = account.pass ||'Grey1472'

    //Inputs
    await page.waitForSelector('input#email')
    await page.waitForSelector('input#password')
    await page.waitForTimeout(2000)

    await page.type('input#email', usuario);
    await page.type('input#password', pass);

    await page.waitForSelector('button#login')
    await page.click('button#login')

    await page.waitForTimeout(3000)
    await page.goto('https://login.minexus.net/codin')

    await page.waitForSelector('div.d-flex.flex-wrap.justify-content-center.align-items-center')

    const divElementButtonsOptions = await page.$$('div.d-flex.flex-wrap.justify-content-center.align-items-center button');

    if(account.name === 'eramine'){
        await divElementButtonsOptions[2].click();
        await page.waitForTimeout(10000)
    }
    if(account.name === 'livent'){
        await divElementButtonsOptions[6].click();
        await page.waitForTimeout(10000)
    }
}
const navigateMinexus = async (page, where) =>{
    switch (where) {
        case 'empleados':
            await page.goto('https://eramine.codin.minexus.net/proveedores/entrances')     
            await page.waitForTimeout(40000)
            break;
        case 'vehiculos':
            await page.goto('https://eramine.codin.minexus.net/proveedores/entrances')
            await page.waitForTimeout(40000)
            break;

        default:
            break;
    }
}

module.exports = {
    logginMinexus,
    navigateMinexus,
}