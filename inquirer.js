import inquirer from 'inquirer';

inquirer.prompt({
    name: 'Menu',
    type: 'list',
    color: 'blue',
    message: 'Que deseas hacer',
    choices: ['Lanzar Bot de WhatsApp', 'Cargar Documentación desde Excel', 'Nada']
})
    .then(answers => {
        if(answers.Menu === 'Lanzar Bot de WhatsApp'){
            console.log('YYEEEEY')
        }
  
    })