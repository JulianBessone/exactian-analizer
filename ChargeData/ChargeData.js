const chargeData = async (page, docuName, periodo, appliesTo, type) =>{
    page.waitForSelector('button.btn.btn-secondary-gd')
    page.click('button.btn.btn-secondary-gd')
    page.waitForTimeout(2000)

    const options = await page.$$('button.btn.popover-opt.d-block.w-100')
    const chargeDataButton = options[0]
    await chargeDataButton.click()
}




const chargeDataOld = async (page, periodo, appliesTo, type) =>{
    // Espera a que el elemento select esté disponible en la página
    await page.waitForSelector('#periodo');
    // Espera a que el elemento input radio esté disponible en la página
    await page.waitForSelector('#contratista');
    await page.waitForSelector('#empleado');
    await page.waitForSelector('#vehiculo');
    await page.waitForSelector('#recurso');
    await page.waitForSelector('#documento')

    // Selecciona una opción por el valor del parametro periodo
    await page.select('#periodo', periodo);

    //En base al parametro appliesTo vamos a seleccionar una de las tres opciones contratista-empleado-vehiculo
    switch (appliesTo) {
        case 'contratista':
            await page.click('#contratista');
        case 'empleado':
            await page.click('#empleado');
        case 'vehiculo':
            await page.click('#vehiculo');
        default:
            break;
    }
    (type === 'recurso')
        ? await page.click('#recurso')
        : await page.click('#documento')

    // Espera a que el botón esté disponible en la página
    await page.waitForSelector('button.btn.btn-sm.btn-primary');
    // Utiliza el método `click` para hacer clic en el botón
    await page.click('button.btn.btn-sm.btn-primary');

}

module.exports = {
    chargeData
}