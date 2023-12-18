const XLSX = require('xlsx');
const fs = require('fs');
const XlsxPopulate = require('xlsx-populate');

const writeExcel = (data) =>{
    // Crear un conjunto para almacenar nombres de propiedades únicos
    const uniqueProperties = new Set();

    data.forEach((item) => {
    for (const key in item) {
        uniqueProperties.add(key);
    }
    });

    // Convertir el conjunto de propiedades únicas a un array
    const uniquePropertiesArray = Array.from(uniqueProperties);

    // Crear un objeto que contenga los datos con propiedades únicas
    const dataWithUniqueProperties = data.map((item) => {
    const newItem = {};
    uniquePropertiesArray.forEach((key) => {
        newItem[key] = item[key] || ''; // Agregar un valor predeterminado si la propiedad no existe en el objeto original
    });
    return newItem;
    });

    // Crear un libro de Excel
    const workbook = XLSX.utils.book_new();

    // Crear una hoja de Excel y agregar los datos con propiedades únicas
    const worksheet = XLSX.utils.json_to_sheet(dataWithUniqueProperties);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');

    // Generar el contenido del archivo de Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    // Guardar el contenido en un archivo
    fs.writeFileSync('Analisis de Documentaciones.xlsx', excelBuffer);
    console.log('Archivo Excel generado con éxito.');

}

const writeExcelMinexusEmployees = async (data) => {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const worksheet = workbook.sheet('Sheet1');

    // Definir la estructura de la primera fila con los encabezados
    const headers = ['Nombre', 'Apellido', 'DNI', 'Estado General', 'Motivos Generales', 'Estado Contractual 1', 'Motivos Contractuales 1', 'Estado Contractual 2', 'Motivos Contractuales 2', 'Estado Contractual 3', 'Motivos Contractuales 3'];
    worksheet.range('A1:K1').value([headers]);

    // Llenar las filas con los datos
    await data.forEach((person, index) => {
        const row = index + 2; // Empezar desde la fila 2 (fila 1 es para los encabezados)

        worksheet.cell(`A${row}`).value(person.name);
        worksheet.cell(`B${row}`).value(person.lastName);
        worksheet.cell(`C${row}`).value(person.dni);
        if(person.generalReason.length > 0){
            //Celda de Docu General
            const currentCell = worksheet.cell(`D${row}`);
            currentCell.value('Rechazado')
            currentCell.style('fill', 'ff0000');

            let generalReason = ''
            person.generalReason.forEach(reason => {
                const key = Object.keys(reason)[0];
                generalReason = generalReason + `\n -${key}: ${reason[key]}`
            })
            worksheet.cell(`E${row}`).value(generalReason)
        }else {
            const currentCell = worksheet.cell(`D${row}`);
            currentCell.value('Aprobado')
            currentCell.style('fill', '008000');
        }

        if(Object.keys(person.contractsReason).length !== 0){

            let columnCode = 70; // Código ASCII para la letra 'F' que es la columna donde empiezan la info de contratos

            for (const contract in person.contractsReason) {

                const element = person.contractsReason[contract];
                //Columna de docu de cada contrato
                const currentCell = worksheet.cell(`${String.fromCharCode(columnCode)}${row}`)
                currentCell.value(`Rechazado ${contract}`)
                currentCell.style('fill', 'ff0000');

                let contractReason = ''
                element.forEach(reason => {
                    const key = Object.keys(reason)[0];
                    contractReason = contractReason + `\n -${key}: ${reason[key]}`
                    
                })
                worksheet.cell(`${String.fromCharCode(columnCode + 1)}${row}`).value(contractReason);
                columnCode += 2;
            }
        }else {
            worksheet.cell(`F${row}`).value(`Aprobado`).style('fill', '008000')    
        }
    });

    // Guardar el archivo
    await workbook.toFileAsync('data.xlsx');
    console.log('Excel generado exitosamente.');
}

const writeExcelMinexusVehi = async (data) => {
    const workbook = await XlsxPopulate.fromBlankAsync();
    const worksheet = workbook.sheet('Sheet1');
    // Definir la estructura de la primera fila con los encabezados
    const headers = ['Patente', 'Modelo', 'Marca', 'Año', 'Estado', 'Motivo'];
    worksheet.range('A1:F1').value([headers]);

    // Llenar las filas con los datos
    data.forEach((vehi, index) => {
        const row = index + 2; // Empezar desde la fila 2 (fila 1 es para los encabezados)
        worksheet.cell(`A${row}`).value(vehi.patente);
        worksheet.cell(`B${row}`).value(vehi.modelo);
        worksheet.cell(`C${row}`).value(vehi.marca);
        worksheet.cell(`D${row}`).value(vehi.anio);
        if(vehi.motivo.length > 0){

            const currentCell = worksheet.cell(`E${row}`)
            currentCell.value('Rechazado');
            currentCell.style('fill', 'ff0000')

            let contractReasonVehi = ''
            vehi.motivo.map((m)=>{
                contractReasonVehi = contractReasonVehi + `\n -${m}`
            })
            
        }else{
            const currentCell = worksheet.cell(`E${row}`)
            currentCell.value('Aprobado');
            currentCell.style('fill', '008000')
        }
    })
    // Guardar el archivo
    await workbook.toFileAsync('Analisis de Documentacion Vehicular Minexus.xlsx');
    console.log('Excel generado exitosamente.');
}

module.exports = {
    writeExcel,
    writeExcelMinexusEmployees,
    writeExcelMinexusVehi
}

