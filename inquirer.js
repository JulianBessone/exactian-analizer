const inquirer = require('inquirer')
const { venomBot, venomCheckInfoVehi, venomCheckInfoEmple, venomCheckInfoContra } = require('./index')
const { leerExcel } = require('./excels')
const { ExactianBot } = require('./puppeteer')
const { selectAccount} = require('./Accounts/Accounts')
const { checkTypePlattaform } = require('./Checkers/Checkers')

inquirer.prompt({
    name: 'Menu',
    type: 'list',
    color: 'blue',
    message: 'Que deseas hacer',
    choices: ['Lanzar Bot de WhatsApp', 'Cargar Documentación desde Excel', 'Verificar Documentación Empleados','Verificar Documentación Vehiculos', 'Verificar Documentación Empresa', 'Verificar la Documentación de Un Solo Empleado', 'Verificar la Documentación de Un Solo Vehiculo' ,'Cerrar']
})
    .then(async (answers) => {
        if(answers.Menu === 'Lanzar Bot de WhatsApp'){
            venomBot()
        }
        
        //***************        CARGAR DOCUMENTACION      *****************/  


        if(answers.Menu === 'Cargar Documentación desde Excel'){
            inquirer.prompt({
                name: 'MenuChargeDataInfo',
                type: 'list',
                color: 'blue',
                message: 'De que Minera deseas Verificar',
                choices: ['Sales', 'Pirquitas', 'Livent', 'Eramine', 'Galaxy', 'Litio', 'Litica', 'Lithea', 'Salta Exploraciones', 'Mansfield', 'Exar', 'Unipar']
            })
            .then( async (answers) => {
                const proyect = answers.MenuChargeDataInfo; //GUARDAMOS EL PROYECTO
            })
            leerExcel()
        }

         //***************        VERIFICAR DOCUMENTACION EMPLEADOS     *****************/  


        if(answers.Menu === 'Verificar Documentación Empleados'){
            inquirer.prompt({
                name: 'MenuInfoEmpleProyect',
                type: 'list',
                color: 'blue',
                message: 'De que Minera deseas Verificar',
                choices: ['Sales', 'Pirquitas', 'Livent', 'Eramine', 'Galaxy', 'Litio', 'Litica', 'Lithea', 'Salta Exploraciones', 'Mansfield', 'Exar', 'Unipar']
            })
            .then( async (answers) => {
                const proyect = answers.MenuInfoEmpleProyect; //GUARDAMOS EL PROYECTO

                inquirer.prompt({
                    name: 'MenuInfoEmpe',
                    type: 'list',
                    color: 'blue',
                    message: 'Donde deseas recibir la información?',
                    choices: ['WhatsApp', 'Excel']
                })
                .then( async (answers)=>{
                    const account = selectAccount(proyect)

                    console.log(account.id, account.pass, account.url)

                    checkTypePlattaform(account, answers.MenuInfoEmpe, 'empleados')                
                })
            })        
        }

         //***************        VERIFICAR DOCUMENTACION VEHICULOS     *****************/  


        if(answers.Menu === 'Verificar Documentación Vehiculos'){
            inquirer.prompt({
                name: 'MenuInfoVehiProyect',
                type: 'list',
                color: 'blue',
                message: 'De que Minera deseas Verificar',
                choices: ['Sales', 'Pirquitas', 'Livent', 'Eramine', 'Galaxy', 'Litio', 'Litica', 'Lithea', 'Salta Exploraciones', 'Mansfield', 'Exar', 'Unipar']
            })
            .then( async (answers)=>{
                const proyect = answers.MenuInfoVehiProyect; //GUARDAMOS EL PROYECTO

                inquirer.prompt({
                    name: 'MenuInfoVehi',
                    type: 'list',
                    color: 'blue',
                    message: 'Donde deseas recibir la información?',
                    choices: ['WhatsApp', 'Excel']
                })
                .then( async (answers) => {
                    const account = selectAccount(proyect)
    
                        console.log(account.id, account.pass, account.url)
    
                        checkTypePlattaform(account, answers.MenuInfoVehi, 'vehiculos')   
                })
            })
            
        }

         //***************        VERIFICAR DOCUMENTACION EMPRESA     *****************/  

        if(answers.Menu === 'Verificar Documentación Empresa'){
            inquirer.prompt({
                name: 'MenuInfoContra',
                type: 'list',
                color: 'blue',
                message: 'Donde deseas recibir la información?',
                choices: ['WhatsApp', 'Excel']
            })
            .then( async (answers) => {
                if(answers.MenuInfoContra === 'WhatsApp'){
                    venomCheckInfoContra()
                }
                else{
                    console.log('...Espera que se inicie el bot de Exactian')
                    const exactianBot = new ExactianBot()
                    await exactianBot.launch()
                    await exactianBot.login()
                    await exactianBot.navegate('generalDocu')
                    await exactianBot.getInfoContra('', '',true)
                    await exactianBot.close()
                }
            })
        }
        if(answers.Menu === 'Verificar la Documentación de Un Solo Empleado'){
            inquirer
                .prompt({
                    name: 'nombreEmpleado',
                    type: 'input',
                    message: 'Ingrese el nombre del empleado (Recuerda que debe ser  el numero de DNI o un apellido o dos apellidos, en caso de agregar un nombre debe ser APELLIDO APELLIDO, NOMBRE NOMBRE. No te olvides de la coma porque sino no encontrará al empleado):',
                })
                .then(async (nombreAnswers) => {
                    // Puedes llamar a funciones o métodos específicos para esta tarea.
                    console.log(`Verificando la documentación de ${nombreAnswers.nombreEmpleado}...`);
                    console.log('...Espera que se inicie el bot de Exactian')
                    const exactianBot = new ExactianBot()
                    await exactianBot.launch()
                    await exactianBot.login()
                    await exactianBot.navegate('generalDocu')
                    await exactianBot.getInfoEmployee('', ``, false, nombreAnswers.nombreEmpleado)
                    await exactianBot.close()
                });
        }
        if(answers.Menu === 'Verificar la Documentación de Un Solo Vehiculo'){
            inquirer
                .prompt({
                    name: 'nombreVehiculo',
                    type: 'input',
                    message: 'Ingrese patente:',
                })
                .then(async (patenteAnswers) => {
                    const patente = patenteAnswers.nombreVehiculo

                    inquirer.prompt({
                        name: 'MenuInfoOneVehiProyect',
                        type: 'list',
                        message: 'De que Minera deseas Verificar',
                        choices: ['Sales', 'Pirquitas', 'Livent', 'Eramine', 'Galaxy', 'Litio', 'Litica', 'Lithea', 'Salta Exploraciones', 'Mansfield', 'Exar', 'Unipar']
                    })
                    .then( async (answers)=>{
                        const proyect = answers.MenuInfoOneVehiProyect; //GUARDAMOS EL PROYECTO
        
                        inquirer.prompt({
                            name: 'MenuInfoOneVehi',
                            type: 'list',
                            color: 'blue',
                            message: 'Donde deseas recibir la información?',
                            choices: ['WhatsApp', 'Excel']
                        })
                        .then( async (answers) => {
                            const account = selectAccount(proyect)
            
                                console.log(account.id, account.pass, account.url)
            
                                checkTypePlattaform(account, answers.MenuInfoOneVehi, 'filterVehi', patente)   
                        })
                    })
                });
        }
        if(answers.Menu === 'Cerrar'){
            return
        }
})