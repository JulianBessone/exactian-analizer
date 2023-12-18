const { writeExcelMinexusEmployees, writeExcelMinexusVehi } = require("../../Excels/writeExel");

const responseAnalizerEmployees = async (response, account, dni) => {
    if(response.url() === 'https://eramine.codin.minexus.net/proxy/staff/all_staff') {
        const responseBody = await response.text();
        const jsonResponse = JSON.parse(responseBody);

        const employeesNotAllowedList = [] //Lista de empleados rechazados 
        const employeesAllowedList = [] //Lista de empleados aprobados

        await jsonResponse.entrance.map(e =>{
            if(e.Estado === 'Rechazado' || e.Estado === 'rechazado'){
                const employee = {} // Por cada empleao rechazado creo un obj temporal que lo agregare a la lista 

                employee.name = e.staff.nombre // nombre 
                employee.lastName = e.staff.apellido // apellido    
                employee.dni = e.staff.dni //dni 
                employee.generalReason = []  // Lista de obj de motivos generales rechazados
                employee.contractsReason = {}  // Lista de obj de motivos contractuales rechazados
                /*
                    {
                        12355: [{constancia: Rechazado}, {capacitacion: Rechazado}],
                        2222: [{constancia: Rechazado}, {capacitacion: Rechazado}],
                    }
                */

                e.motivo.forEach(obj => {
                    if(!obj.Contract){
                        const key = Object.keys(obj)[0];
                        const decodedKey = JSON.parse(`"${key}"`);
                        const tempObj = {};
                        tempObj[decodedKey] = obj[key];

                        employee.generalReason.push(tempObj)
                        return
                    }

                    const reason = {}
                    reason[obj.data.name] = obj.data.Status //{constancia: Rechazado}
                    if(!employee.hasOwnProperty(obj.Contract.sap_id)){ employee.contractsReason[obj.Contract.sap_id] = [] }
                    employee.contractsReason[obj.Contract.sap_id].push(reason)                 
                });
                employeesNotAllowedList.push(employee)
            }
            if(e.Estado === 'Aprobado' || e.Estado === 'aprobado' || e.Estado === 'Permitido' || e.Estado === 'permitido' || e.Estado === 'no asignado'){
                const employee = {} // Por cada empleado aprobado creo un obj temporal que lo agregare a la lista 

                employee.name = e.staff.nombre // nombre 
                employee.lastName = e.staff.apellido // apellido    
                employee.dni = e.staff.dni //dni 
                employee.generalReason = []  // Lista de obj de motivos generales rechazados
                employee.contractsReason = {}  // Lista de obj de motivos contractuales rechazados

                employeesAllowedList.push(employee)
            }
        })
        const allResourcesList = [...employeesNotAllowedList, ...employeesAllowedList]
        if(dni){
            findEmple(allResourcesList, dni)
        }else{
            writeExcelMinexusEmployees(allResourcesList, account)
        }
    }  
}

const responseAnalizerVehi = async (response, account, patente) => {
    if(response.url() === 'https://eramine.codin.minexus.net/proxy/vehicles/entrance') {
        const responseBody = await response.text();
        const jsonResponse = JSON.parse(responseBody);

        const vehiNotAllowedList = []; //Lista de vehiculos rechazados
        const vehiAllowedList = [];

        await jsonResponse.map( (vehi) =>{
            if(vehi.estado === 'rechazado' || vehi.estado === 'Rechazado'){
                const vehiculo = {}

                vehiculo.marca = vehi.marca;
                vehiculo.modelo = vehi.modelo;
                vehiculo.anio = vehi.anio;
                vehiculo.patente = vehi.patente;
                vehiculo.estado = vehi.estado;
                vehiculo.motivo = []

                vehi.motivo.map((motivo) => {
                    const key = Object.keys(motivo)[0];
                    const decodedKey = JSON.parse(`"${key}"`);
                    vehiculo.motivo.push(`${decodedKey}: ${motivo[key]}`)
                })

                vehiNotAllowedList.push(vehiculo)
            }
            if(vehi.estado === 'aprobado' || vehi.estado === 'aprobado' || vehi.estado === 'no asignado'){
                const vehiculo = {}

                vehiculo.marca = vehi.marca;
                vehiculo.modelo = vehi.modelo;
                vehiculo.anio = vehi.anio;
                vehiculo.patente = vehi.patente;
                vehiculo.estado = vehi.estado;
                vehiculo.motivo = []

                vehiAllowedList.push(vehiculo)
            }
        })
        //Si recibe una patente buscara el objeto si no  escribira el excel
        if(patente){
            findVehi([...vehiNotAllowedList, ...vehiAllowedList], patente)
        }else{
            writeExcelMinexusVehi([...vehiNotAllowedList, ...vehiAllowedList], account)
        }   
    }
}

const findVehi = async (data, patente) => {
    const result = data.find((vehi) => {
        return (vehi.patente.toUpperCase() === patente.toUpperCase())
    })
    console.log(result)
}
const findEmple = async (data, dni) => {
    let resultWithStatus = {}
    const result = await data.find((employee) => {
        return (employee.dni.toUpperCase() === dni.toUpperCase())
    })
    if(result.generalReason.length <= 0 && Object.keys(result.contractsReason).length === 0){
        resultWithStatus = { estado: 'Aprobado', ...result}
    } else{
        resultWithStatus = { estado: 'Rechazado', ...result}
    }
    console.log(resultWithStatus)
}

const responseAnalizerClg = async (response) => {
    if(response.url() === 'https://eramine.codin.minexus.net/proxy/staff/all_staff') {
        const responseBody = await response.text();
        const jsonResponse = JSON.parse(responseBody);
        jsonResponse.entrance.map(e =>{
            if(e.Estado === 'Rechazado' || e.Estado === 'rechazado'){
                console.log(`\n El empleado ${e.staff.nombre} ${e.staff.apellido} ${e.staff.dni} esta Rechazado:\n`)

                let adviseGeneralReason = false
                let adviseContractID = null

                e.motivo.forEach(obj => {
                    if(!obj.Contract){
                        (!adviseGeneralReason) ? console.log('\n Motivos Generales:\n'): adviseGeneralReason = true
                        adviseGeneralReason = true
                        const key = Object.keys(obj)[0];
                        const decodedKey = JSON.parse(`"${key}"`);
                        console.log(`-${decodedKey}: ${obj[key]}`);
                        return
                    }
                    if(adviseContractID !== obj.Contract.sap_id){
                        console.log(`\n Motivos de Contrato (${obj.Contract.sap_id})\n`)
                        adviseContractID = obj.Contract.sap_id
                    }
                    console.log(`-${obj.data.name} : ${obj.data.Status}`)
                    
                });
            }
        })
    }  
}

module.exports = {
    responseAnalizerEmployees,
    responseAnalizerVehi
}

