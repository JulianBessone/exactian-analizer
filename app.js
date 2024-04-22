const xlsx = require ('xlsx');
const fs = require('fs');
const path = require('path');
// Obtener el directorio del escritorio
const desktopDir = path.join(require('os').homedir(), 'Desktop');

const excelDirectoryPath = './excels';
// Lee el contenido del directorio
fs.readdir(excelDirectoryPath, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio:', err);
        return;
    }

    // Encuentra el primer archivo Excel en el directorio
    const excelFile = files.find(file => file.endsWith('.xls'));

    if (!excelFile) {
        console.error('No se encontraron archivos Excel en el directorio.');
        return;
    }
    // Ruta completa del archivo Excel
    const excelFilePath = path.join(excelDirectoryPath, excelFile);

    // Ahora puedes leer y procesar el archivo Excel
    console.log('Nombre del archivo Excel encontrado:', excelFile);
    //console.log('Ruta completa del archivo Excel:', excelFilePath);

    // Lee el archivo Excel
    const workbook = xlsx.readFile(excelFilePath);
    // Obtiene la primera hoja del libro de trabajo
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // Convierte la hoja de cálculo a formato JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // Muestra la información en formato JSON
    console.log("información copiada");
    generarExcel(jsonData);
})

// Función para generar un archivo Excel
// Función para generar un archivo Excel con las columnas necesarias
function generarExcel(data) {
    // Filtrar solo las columnas necesarias (Fecha, Concepto, Débito, Crédito)
    const newData = data.map(item => ({
      Fecha: item.Fecha,
      Concepto: item.Concepto,
      Importe:  item['Crédito'] - item['Débito']
    }));
  
    // Crear una nueva hoja de cálculo
    const ws = xlsx.utils.json_to_sheet(newData);
  
    // Modificar el encabezado de las columnas
    ws['!cols'] = [{ wch: 15 }, { wch: 50 }, { wch: 15 }];
  
    // Modificar el nombre de las columnas
    ws['A1'].v = 'Fecha';
    ws['B1'].v = 'Concepto';
    ws['C1'].v = 'Importe';
  
    // Crear un nuevo libro de trabajo
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Data');
  
    console.log(`Archivo Excel creado`);
    
    // Guardar el archivo Excel
    const filePath = `${desktopDir}/extracto-limpio.xlsx`;
    xlsx.writeFile(wb, filePath);
    console.log(`Archivo Excel generado: ${filePath}`);
}



