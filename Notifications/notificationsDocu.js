const notifyDocEmpleProblems = async (client, groupID, docInfoEmple) => {
    for (const emple of docInfoEmple) {
        const name = emple.nombre
        let problems = ''

        for (const prop in emple) {
            const element = emple[prop];
            if(element ==='No esta presentada'){
                problems += `*ALERTA:* ${prop} *SIN PRESENTAR*\n`   
            }   

            if(element === 'Vencida'){
                problems += `*ALERTA:* ${prop} *VENCIDA*\n`
            }
        }
        if(problems){
            await client.sendText(`${groupID}@g.us`,`
                🚨⚠️ *ALERTA EL TRABAJADOR ${name} TIENE LA SIGUIENTE DOCU A REVISAR* ⚠️🚨 
                \n
                \n
                \n
                ${problems}
            `)
        }
    }
}
const notifyDocVehiProblems = async (client, groupID, docInfoVehi) => {
    for (const vehi of docInfoVehi) {
        const name = vehi.nombre
        let problems = ''

        for (const prop in vehi) {
            const element = vehi[prop];
            if(element ==='No esta presentada'){
                problems += `*ALERTA:* ${prop} *SIN PRESENTAR*\n`   
            }   

            if(element === 'Vencida'){
                problems += `*ALERTA:* ${prop} *VENCIDA*\n`
            }
        }
        if(problems){
            await client.sendText(`${groupID}@g.us`,`
                🚨⚠️ *ALERTA EL VEHICULO ${name} TIENE LA SIGUIENTE DOCU A REVISAR* ⚠️🚨 
                \n
                \n
                \n
                ${problems}
            `)
        }
    }
}


module.exports = {
    notifyDocEmpleProblems,
    notifyDocVehiProblems
};