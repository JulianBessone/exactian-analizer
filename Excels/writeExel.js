const XLSX = require('xlsx');
const fs = require('fs');

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

module.exports = {
    writeExcel
}

