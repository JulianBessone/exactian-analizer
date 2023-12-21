const xlsx = require ('xlsx');

const leerExcelCargaEmpleadosMinexus = async () =>{
   const employees = []

   const pathTracking = `./Excels/Documentacion de empleados para cargar.xlsx`;
    const workbook = xlsx.readFile(pathTracking);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];

    /* TRANSFORMAMOS LAS TABLAS A UN ARCHIVO TIPO .JSON */

    const dataExcel = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
    return(dataExcel)
}

module.exports = {
    leerExcelCargaEmpleadosMinexus
}
