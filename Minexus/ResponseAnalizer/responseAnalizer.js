const responseAnalizer = async (response) => {
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
