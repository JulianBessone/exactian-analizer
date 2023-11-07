const inquirer = require('inquirer')
const { venomBot, venomCheckInfoVehi } = require('./index')
const { leerExcel } = require('./excels')
const { ExactianBot } = require('./puppeteer')

inquirer.prompt({
    name: 'Menu',
    type: 'list',
    color: 'blue',
    message: 'Que deseas hacer',
    choices: ['Lanzar Bot de WhatsApp', 'Cargar Documentación desde Excel', 'Verificar Documentación Empleados','Verificar Documentación Vehiculos', 'Verificar Documentación Empresa', 'Verificar la Documentación de Un Solo Empleado' ,'Cerrar']
})
    .then(async (answers) => {
        if(answers.Menu === 'Lanzar Bot de WhatsApp'){
            venomBot()
        }
        if(answers.Menu === 'Cargar Documentación desde Excel'){
            leerExcel()
        }
        if(answers.Menu === 'Verificar Documentación Empleados'){
            inquirer.prompt({
                name: 'MenuInfoEmpe',
                type: 'list',
                color: 'blue',
                message: 'Donde deseas recibir la información?',
                choices: ['WhatsApp', 'Excel']
            })
            .then( async (answers) => {
                if(answers.MenuInfoEmpe === 'WhatsApp'){
                    venomCheckInfoVehi()
                }
                else{
                    console.log('...Espera que se inicie el bot de Exactian')
                    const exactianBot = new ExactianBot()
                    await exactianBot.launch()
                    await exactianBot.login()
                    await exactianBot.navegate('generalDocu')
                    await exactianBot.getInfoEmployee('', ``, true)
                    await exactianBot.close()
                }
            })
            
        }
        if(answers.Menu === 'Verificar la Documentación de Un Solo Empleado'){
            inquirer
                .prompt({
                    name: 'nombreEmpleado',
                    type: 'input',
                    message: 'Ingrese el nombre del empleado (Recuerda que debe ser uno apellido o dos apellidos, en caso de agregar un nombre debe ser APELLIDO APELLIDO, NOMBRE NOMBRE. No te olvides de la coma porque sino no encontrará al empleado):',
                })
                .then((nombreAnswers) => {
                    // Puedes llamar a funciones o métodos específicos para esta tarea.
                    console.log(`Verificando la documentación de ${nombreAnswers.nombreEmpleado}...`);
                });
        }
        if(answers.Menu === 'Cerrar'){
            return
        }

    })