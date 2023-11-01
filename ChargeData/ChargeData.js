const path = require('path');

const chargeData = async (page, docuName, appliesTo, documentForCharge, type) =>{
    ////*************************     PASO UNO     ******************************/
    await page.goto('https://pres.exactian.app/ganfenglatam/documentSubmission/globalPresentation'); //NOS DIRIGIMOS AL LINK PARA PRESENTAR DOCU

    // Aquí divido el nombre de la documentación por corchetes
    //Esto va permitir chequear si es un array con dos pocisiones la docu a presentar tendra que especificar perido
    let docuNameHaveDateCheck = await docuName.split('[')
    let docuNameNoDate = docuNameHaveDateCheck[0]
    await page.waitForTimeout(5000)
    await page.waitForSelector('input#react-select-2-input')
    await page.type('input#react-select-2-input', docuNameNoDate);//Le pasamos la primera posición de la doco divida por fecha
    const searchInput = await page.$('input#react-select-2-input');
    await searchInput.press('Enter')
    await page.waitForTimeout(6000)
    const divDatePicker = await page.$('div.react-datepicker-wrapper div input')
    

    if(docuNameHaveDateCheck[1] && docuNameHaveDateCheck[1] !== 'Presentación única]' && divDatePicker){
        let periodo = await docuNameHaveDateCheck[1].split(']')
        periodo = await periodo[0].split('-')
        let month = await periodo[1]
        let year = await periodo[2]
        let fullDate = `${month}/${year}`
        console.log(fullDate)
        await divDatePicker.click()

        await page.evaluate(() => {
            document.querySelector('div.react-datepicker-wrapper div input').value = ''; // Establece el valor del campo como una cadena vacía.
        });
        await page.type('div.react-datepicker-wrapper div input', fullDate)
        await page.waitForTimeout(1000)
        await divDatePicker.press('Enter')
        console.log('SE PUSO LA FECHA')
    }

    const divButtonSubmit = await page.$('div#submitButtonMessage button')
    await divButtonSubmit.click()

    ////*************************     PASO DOS     ******************************/
    await page.waitForSelector('input.form-control.input-search')
    const searchName = await page.$('input.form-control.input-search')
    await page.type('input.form-control.input-search', appliesTo)
    await searchName.press('Enter')
    await page.waitForSelector('div.mt-4')

    const divCheckBox = await page.$('div.global-resource-list div input')
    await divCheckBox.click()

    const buttonContinue = await page.$('button.btn-secondary-gd')
    await buttonContinue.click();

    ////*************************     PASO TRES     ******************************/
    await page.waitForSelector('section.bg-dropzone div input') //El input para subir el archivo
    const fileInput = await page.$('section.bg-dropzone div input');

    // Directorio actual de tu proyecto
    const directorioProyecto = __dirname;
    // Nombre del archivo que deseas cargar
    const nombreArchivo = documentForCharge;
    // Construye la ruta completa al archivo
    const filePath = path.join(directorioProyecto, nombreArchivo);
    console.log(filePath)
    await fileInput.uploadFile(filePath);

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