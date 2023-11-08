const notifyDocContra = async (client, user, docInfoDoc) => {
    let problems = ''
    for (const prop in docInfoDoc) {
        const element = docInfoDoc[prop];
        if(element ==='No esta presentada'){
            problems += `*ALERTA:* ${prop} *SIN PRESENTAR*\n`   
        }   

        if(element === 'Vencida'){
            problems += `*ALERTA:* ${prop} *VENCIDA*\n`
        }
    }
    if(problems){
        await client.sendText(user,`
            🚨⚠️ *ALERTA LA EMPRESA TIENE LA SIGUIENTE DOCU A REVISAR* ⚠️🚨 
            \n
            \n
            \n
            ${problems}
        `)
    }

}

const notifyDocEmpleProblems = async (client, user, docInfoEmple) => {
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
            await client.sendText(user,`
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
    notifyDocVehiProblems,
    notifyDocContra
}