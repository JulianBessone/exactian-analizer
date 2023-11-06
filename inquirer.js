const inquirer = require('inquirer')
const { venomBot } = require('./index')
const { leerExcel } = require('./excels')

inquirer.prompt({
    name: 'Menu',
    type: 'list',
    color: 'blue',
    message: 'Que deseas hacer',
    choices: ['Lanzar Bot de WhatsApp', 'Cargar Documentación desde Excel', 'Nada']
})
    .then(answers => {
        if(answers.Menu === 'Lanzar Bot de WhatsApp'){
            venomBot()
        }
        if(answers.Menu === 'Cargar Documentación desde Excel'){
            leerExcel()
        }
    })