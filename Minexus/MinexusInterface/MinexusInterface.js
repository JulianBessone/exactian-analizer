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

    await page.click('input#login')

    await page.waitForTimeout(3000)
    await page.goto('https://login.minexus.net/codin')

    await page.waitForSelector('div.d-flex.flex-wrap.justify-content-center.align-items-center')

    const divElementButtonsOptions = await page.$$('div.d-flex.flex-wrap.justify-content-center.align-items-center button');

    if(account.name === 'eramine'){
        await divElementButtonsOptions[1].click();
        await page.waitForTimeout(10000)
    }
    if(account.name === 'livent'){
        await divElementButtonsOptions[6].click();
        await page.waitForTimeout(10000)
    }
}
module.exports = {
    logginMinexus,
}