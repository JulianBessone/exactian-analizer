const xlsx = require ('xlsx');
const { ExactianBot } = require ('./puppeteer')

const leerExcel = async () => {
    const docusForUpload = [];

    const pathTracking = `./Excels/excel.xlsx`;
    const workbook = xlsx.readFile(pathTracking);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];

    /* TRANSFORMAMOS LAS TABLAS A UN ARCHIVO TIPO .JSON */

    const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])

    /* ITERAMOS LOS ELEMENTOS DE DATA EXCEL */

    for (const docus of dataExcel){
        const docuInfo = {}
        docuInfo.tramite = await docus['Tramite']
        let periodoComplete = await docus['Periodo']
        let periodoDividido = await periodoComplete.split('/')
        docuInfo.periodo = `${periodoDividido[0]}/20${periodoDividido[1]}`
        docuInfo.recurso = await docus['Recurso']
        docuInfo.path = await docus['Nombre Archivo pdf o jpg']
        docusForUpload.push(docuInfo)
    }

    console.log(docusForUpload)
    const exactianBot = new ExactianBot()
	await exactianBot.launch()
	await exactianBot.login()
	await exactianBot.navegate('presentarDocu')

    for (const docu of docusForUpload) {
        const pathComplete = `Documents/${docu.path}`;
        console.log(docu.tramite)
        try {
            await exactianBot.chargeData(docu.tramite, docu.periodo, docu.recurso, pathComplete)
        } catch (error) {
            console.log('Hay un error:\n', error)
        }
    }
}

module.exports = {
    leerExcel
}