const { writeExcelMinexusEmployees } = require("../../Excels/writeExel");

const responseAnalizer = async (response) => {
    if(response.url() === 'https://eramine.codin.minexus.net/proxy/staff/all_staff') {
        const responseBody = await response.text();
        const jsonResponse = JSON.parse(responseBody);

        const employeesNotAllowedList = [] //Lista de empleados rechazados 

        await jsonResponse.entrance.map(e =>{
            if(e.Estado === 'Rechazado' || e.Estado === 'rechazado'){

                const employee = {} // Por cada empleao rechazado creo un obj temporal que lo agregare a la lista 

                employee.name = e.staff.nombre // nombre 
                employee.lastName = e.staff.apellido // apellido    
                employee.dni = e.staff.dni //dni 
                employee.generalReason = []  // Lista de obj de motivos generales rechazados
                employee.contractsReason = {}  // Lista de obj de motivos contractuales rechazados

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
                    reason[obj.data.name] = obj.data.Status
                    if(!employee.hasOwnProperty(obj.Contract.sap_id)){ employee.contractsReason[obj.Contract.sap_id] = [] }
                    employee.contractsReason[obj.Contract.sap_id].push(reason)                 
                });
                employeesNotAllowedList.push(employee)
            }
        })
        writeExcelMinexusEmployees(employeesNotAllowedList)
    }  
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
    responseAnalizer
}
