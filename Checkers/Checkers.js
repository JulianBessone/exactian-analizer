const { venomCheckInfoEmple } = require('../index');
const { ExactianBot } = require('../Exactian/Exactian');
const { MinexusBot } = require('../Minexus/minexus');

/***
 * Esta función recibe el objeto account como parametro, luego verificara el valor de account.type el cual
 * nos va decir que tipo de plataforma minera es, actualmente son Sicop, Minexus y Exactian.
 * El parametro outputSendInfo que es donde el usuario desea recibir la información obtenida. 
 * El parametro type es el tipo de acciones que el bot va realizar, puede ser cargar documentación desde excel,
 * obtener la info de la empresa, obtener la info de todos los empleados, obtener la info de todos los vehiculos,
 * obtener la info de un soloempleado, o de un solo auto.
 * El parametro oneInfo es el dni o patente en caso de que se seleccione obener la info de un solo recurso
 */


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
                const minexusBot = new MinexusBot() //Creo una instancia de la clase MinexusBot
                await minexusBot.launch(account) //invoco el metodo launch para lanzar el navegador en 2do plano
                await minexusBot.login(account) //invoco el metodo login para inciar la secion y le paso el parametro account para que ingrese segun la cuenta seleccionada del proyecto minero correspondiente

                if(type === 'empleados'){
                    await minexusBot.personalInfoCheck(account)
                }
                if(type === 'vehiculos'){
                    await minexusBot.vehiculosInfoCheck(account)
                }
                if(type === 'empresa'){
                    console.log('modulo inactivo')
                }
                if(type === 'filterEmployee'){
                    await minexusBot.personalInfoCheck(account, oneInfo) //le paso oneInfo como parametro para que busque por dni
                }
                if(type === 'filterVehi'){
                    await minexusBot.vehiculosInfoCheck(account, oneInfo) //le paso oneInfo como parametro para que busque por Patente
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

                const exactianBot = new ExactianBot() //Creo una instancia de la clase MinexusBot
                await exactianBot.launch(account) //invoco el metodo launch para lanzar el navegador en 2do plano
                await exactianBot.login(account) //invoco el metodo login para inciar la secion y le paso el parametro account para que ingrese segun la cuenta seleccionada del proyecto minero correspondiente
                if(type === 'empleados'){
                    await exactianBot.navegate('generalDocu',account)
                    await exactianBot.getInfoEmployee('', ``, true, null, account)
                }
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