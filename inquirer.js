const inquirer = require('inquirer') // Obtengo a Inquirer que es un paquete para sistemas de consolas usando JS
const { venomBot, venomCheckInfoVehi, venomCheckInfoEmple, venomCheckInfoContra } = require('./index')
const { selectAccount} = require('./Accounts/Accounts') //Es una fn que retorna un objto con info de inicio de sesion en base a la selección del proyecto minero
const { checkTypePlattaform } = require('./Checkers/Checkers')//Es una FN que en base al tipo de plataforma pasada por parametro realizara las instrucciones pertinetes pasadas tambien por parametro
const { leerExcel } = require('./excels')
const { ExactianBot } = require('./puppeteer')
const { proyectsChoices } = require('./Utils/choices')

inquirer.prompt({
    name: 'Menu',
    type: 'list',
    color: 'blue',
    message: 'Que deseas hacer',
    choices: ['Lanzar Bot de WhatsApp', 'Cargar Documentación desde Excel', 'Verificar Documentación Empleados','Verificar Documentación Vehiculos', 'Verificar Documentación Empresa', 'Verificar la Documentación de Un Solo Empleado', 'Verificar la Documentación de Un Solo Vehiculo' ,'Cerrar']
})
    //en base a la respuesta haremos una serie de acciones:
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
                message: 'De que Minera deseas Cargar',
                choices: proyectsChoices
            })
            .then( async (answers) => {
                const proyect = answers.MenuChargeDataInfo; //GUARDAMOS EL PROYECTO

                const account = selectAccount(proyect)
                checkTypePlattaform(account, null, 'CargarDocuMasivaEmple') 
            })
        }

         //***************        VERIFICAR DOCUMENTACION EMPLEADOS     *****************/  


        if(answers.Menu === 'Verificar Documentación Empleados'){
            // Preguntaremos que proyecto minero deseas elegir
            inquirer.prompt({
                name: 'MenuInfoEmpleProyect',
                type: 'list',
                color: 'blue',
                message: 'De que Minera deseas Verificar',
                choices: proyectsChoices //Le pasaremos el listado de proyectos mineros a elegir
            })
            .then( async (answers) => {
                const proyect = answers.MenuInfoEmpleProyect; //GUARDAMOS EL PROYECTO SELECCIONADO POR EL USUARIO

                inquirer.prompt({
                    name: 'MenuInfoEmpe',
                    type: 'list',
                    color: 'blue',
                    message: 'Donde deseas recibir la información?',
                    choices: ['WhatsApp', 'Excel']
                })
                .then( async (answers)=>{

                    const account = selectAccount(proyect) //Inicializamos la variable account en base al obj que retorna la fn selectAccount

                    console.log(`USUARIO: ${account.id}`, `CONTRASEÑA: ${account.pass}`, `URL: ${account.url}`) //Imprimimos la data

                    checkTypePlattaform(account, answers.MenuInfoEmpe, 'empleados') // Invocamos la fn que recibe la info de la cuenta, donde el usuario desea recibir la info, y el tipo de acción que desea hacer.
                })
            })        
        }

         //***************        VERIFICAR DOCUMENTACION VEHICULOS     *****************/  


        if(answers.Menu === 'Verificar Documentación Vehiculos'){
            // Preguntaremos que proyecto minero deseas elegir
            inquirer.prompt({
                name: 'MenuInfoVehiProyect',
                type: 'list',
                color: 'blue',
                message: 'De que Minera deseas Verificar',
                choices: proyectsChoices //Le pasaremos el listado de proyectos mineros a elegir
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
                    const account = selectAccount(proyect)//Inicializamos la variable account en base al obj que retorna la fn selectAccount
    
                    console.log(`USUARIO: ${account.id}`, `CONTRASEÑA: ${account.pass}`, `URL: ${account.url}`) //Imprimimos la data
    
                    checkTypePlattaform(account, answers.MenuInfoVehi, 'vehiculos') // Invocamos la fn que recibe la info de la cuenta, donde el usuario desea recibir la info, y el tipo de acción que desea hacer.   
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
                    message: 'Ingrese el numero de DNI (Recuerda que debe ser sin puntos, por ejemplo: 40729043):',
                })
                .then(async (nombreAnswers) => {
                    const dni = nombreAnswers.nombreEmpleado // guardamos el dni del empleado

                    // Preguntaremos que proyecto minero deseas elegir
                    inquirer.prompt({
                        name: 'MenuInfoOneEmployeeProyect',
                        type: 'list',
                        color: 'blue',
                        message: 'De que Minera deseas Verificar',
                        choices: proyectsChoices //Le pasaremos el listado de proyectos mineros a elegir
                    })
                    .then(async (answers) =>{
                        const proyect = answers.MenuInfoOneEmployeeProyect; //GUARDAMOS EL PROYECTO

                        inquirer.prompt({
                            name: 'MenuInfoOneVehi',
                            type: 'list',
                            color: 'blue',
                            message: 'Donde deseas recibir la información?',
                            choices: ['WhatsApp', 'Consola']
                        })
                        .then( async (answers) => {
                            const account = selectAccount(proyect)//Inicializamos la variable account en base al obj que retorna la fn selectAccount
            
                            console.log(`USUARIO: ${account.id}`, `CONTRASEÑA: ${account.pass}`, `URL: ${account.url}`) //Imprimimos la data
            
                            checkTypePlattaform(account, answers.MenuInfoOneVehi, 'filterEmployee', dni) // Invocamos la fn que recibe la info de la cuenta, donde el usuario desea recibir la info, y el tipo de acción que desea hacer.   
                        })
                    })
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
                        choices: proyectsChoices //Le pasaremos el listado de proyectos mineros a elegir
                    })
                    .then( async (answers)=>{
                        const proyect = answers.MenuInfoOneVehiProyect; //GUARDAMOS EL PROYECTO
        
                        inquirer.prompt({
                            name: 'MenuInfoOneVehi',
                            type: 'list',
                            color: 'blue',
                            message: 'Donde deseas recibir la información?',
                            choices: ['WhatsApp', 'Pantalla']
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