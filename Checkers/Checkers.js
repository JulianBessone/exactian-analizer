const { venomCheckInfoEmple } = require('../index');
const { ExactianBot } = require('../Exactian/Exactian');
const { MinexusBot } = require('../Minexus/minexus');

const checkTypePlattaform = async (account, outputSendInfo, type, oneInfo) => {
    
    switch (account.type) {
        case 'Sicop':
            
            break;
        case 'Minexus':
            if(outputSendInfo === 'WhatsApp'){
                venomCheckInfoEmple(account)
            }
            else{
                console.log('...Espera que se inicie el bot de Minexus')
                const minexusBot = new MinexusBot()
                await minexusBot.launch(account)
                await minexusBot.login(account)

                if(type === 'empleados'){
                    await minexusBot.personalInfoCheck()
                }
                if(type === 'vehiculos'){
                    await minexusBot.vehiculosInfoCheck()
                }
                if(type === 'empresa'){
                    console.log('modulo inactivo')
                }
                if(type === 'filterEmployee'){
                    console.log('modulo inactivo')
                }
                if(type === 'filterVehi'){
                    await minexusBot.vehiculosInfoCheck(oneInfo)
                }

                await minexusBot.close()
            }
            break;
        case 'Exactian':
            if(outputSendInfo === 'WhatsApp'){
                venomCheckInfoEmple(account)
            }
            else{
                console.log('...Espera que se inicie el bot de Exactian')
                const exactianBot = new ExactianBot()
                await exactianBot.launch(account)
                await exactianBot.login(account)
                await exactianBot.navegate('generalDocu',account)
                await exactianBot.getInfoEmployee('', ``, true)
                await exactianBot.close()
            }
            break;
        
        default:
            break;
    }
}

module.exports = {
    checkTypePlattaform
}