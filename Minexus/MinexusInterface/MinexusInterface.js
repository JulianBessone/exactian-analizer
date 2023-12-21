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
    if(account.name === 'riotinto'){
        await divElementButtonsOptions[8].click();
        await page.waitForTimeout(10000)
    }
}
const navigateMinexus = async (page, where, account) =>{
    switch (where) {
        case 'empleados':
            await page.goto(`https://${account.name}.codin.minexus.net/proveedores/entrances`)     
            await page.waitForTimeout(40000)
            break;
        case 'vehiculos':
            await page.goto(`https://${account.name}.codin.minexus.net/proveedores/entrances`)
            await page.waitForTimeout(40000)
            break;
        case 'cargarEmpleMasivo':
            await page.goto(`https://${account.name}.codin.minexus.net/proveedores/staff/add`)
            await page.waitForTimeout(5000)
            break;
        default:
            break;
    }
}

const chargePeople = async (page, data) => {
    try {
        let dni = data['CUIL'].split('-')

        await page.waitForSelector('#dni-c')
        await page.type('#name', data.Nombre)
        await page.type('#surname', data.Apellido)
        await page.type('#dni-c', dni[1])
    
        if(data.Sexo === 'M'){
            // Seleccionar la opción "Masculino" en el elemento <select> por su ID
            const selectValueM = 'Masculino';
            await page.select('#gender', selectValueM);
        }else{
        // Seleccionar la opción "Masculino" en el elemento <select> por su ID
        const selectValueF = 'Femenino';
            await page.select('#gender', selectValueF);
        }
        // Ruta al archivo que quieres subir
        const filePath = `/Documents/Proyecto Rio Tinto 2023/1) Construcción de Tanques/${data.Apellido}, ${data.Nombre}/DNI ${data.    Apellido.toUpperCase()} ${data.Nombre.toUpperCase()}.pdf`;

        // Seleccionar el input de archivo y subir el archivo
        const fileInput = await page.$('#dni-copy');
        await fileInput.uploadFile(filePath);

        // Encuentra el elemento que deseas modificar
        const element1 = await page.$('#collapse1');
        const element2 = await page.$('#collapse2')
        const element3 = await page.$('#collapse3')
        // Ejecuta código JavaScript en la página para cambiar el estilo del elemento
        await page.evaluate(() => {
            const el = document.querySelector('#collapse1');
            const el2 = document.querySelector('#collapse2');
            const el3 = document.querySelector('#collapse3');
            el.style.display = 'flex'; // Cambia el display para poder verlo en la web
            el2.style.display = 'flex';
            el3.style.display = 'flex';
        });

        const inputSelectorCountry = '#country div div input';
        const inputSelectorProv = '#cities div div input';
        const inputSelectorMuni = '#municipalities div div input';

        await page.$eval(inputSelectorCountry, (input, value) => input.value = value, 'Argentina');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter')

        await page.$eval(inputSelectorProv, (input, value) => input.value = value, 'Salta');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter')

        if(data.Departamento){
            await page.$eval(inputSelectorMuni, (input, value) => input.value = value , data.Departamento)
        }else{
            await page.$eval(inputSelectorMuni, (input, value) => input.value = value, data.Departamento)
        }
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter')

        const inputSelectorResidenceCountry = '#residenceCountry div div input';
        const inputSelectorResidenceState = '#residenceState div div input';
        const inputSelectorResidenceDepartment = '#residenceDepartment div div input';

        await page.$eval(inputSelectorResidenceCountry, (input, value) => input.value = value, 'Argentina');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');

        await page.$eval(inputSelectorResidenceState, (input, value) => input.value = value, 'Salta');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');

        await page.$eval(inputSelectorResidenceDepartment, (input, value) => input.value = value, 'Capital');
        await page.waitForTimeout(1000);
        await page.keyboard.press('Enter');

        const cuil = await page.$$('#cuil')
        const cuilFirst = cuil[0]
        const cuilSecond = cuil[1]
        
        await cuilFirst.type(dni[0])
        await cuilSecond.type(dni[2])
        await page.waitForTimeout(3000)

        const inputSelectorStaffType = '#staff_type';
        await page.select('#staff_type', 'Relación de dependencia');

        await page.waitForTimeout(1000)
        await page.evaluate(() => {
            const select = document.querySelector('#puesto');
            select.value = '1';
            select.dispatchEvent(new Event('change'));
        });
        await page.waitForTimeout(1000)
        await page.type('#cargo', data.DetallesPuesto)

        const inputSelectorConvenio = '#convenio_laboral_id div div input'
        await page.waitForSelector('#convenio_laboral_id div div input');
        if(data.Convenio){
            await page.type(inputSelectorConvenio, data.Convenio);
        }else{
            await page.type(inputSelectorConvenio, '0001');
        }
        await page.waitForTimeout(2000)
        await page.keyboard.press('Enter');

        await page.waitForTimeout(60000)

        console.log(`Personal: ${data.Nombre} ${data.Apellido}, subido correctamente ☑️`)
    } catch (error) {
        console.error(error)
    }finally{
        console.log('🔝')
    }
}

module.exports = {
    logginMinexus,
    navigateMinexus,
    chargePeople,
}