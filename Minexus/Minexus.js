const puppeteer = require('puppeteer')
const { logginMinexus, navigateMinexus } = require("./MinexusInterface/MinexusInterface");
const { responseAnalizerEmployees, responseAnalizerVehi } = require('./ResponseAnalizer/ResponseAnalizer');

class MinexusBot {
    constructor() {
        this.browser = null;
        this.page = null;
        this.employees = null;
        this.vehi = null
    }

    async launch(account) {
        this.browser = await puppeteer.launch({
             headless: false
             //args: [ '--proxy-server=178.169.139.180:8080']
        }); 
        this.page = await this.browser.newPage();

        await this.page.goto(account.url ||'https://ganfenglatam.exactian.solutions'); //Accedo a la web de exactian Ganfen 
    }

    //Analizaremos las response request del navegador
    async requestAnalizer(type, account, oneInfo){ // el parametro oneInfo se utiliza para filtrar por DNI o por Patente puede estar presente o no
        if(type === 'trabajadores'){
            this.page.on('response',async (response) =>{
                responseAnalizerEmployees(response,account, oneInfo)
            })
        }
        if(type === 'vehiculos'){
            this.page.on('response',async (response) =>{
                responseAnalizerVehi(response,account, oneInfo) //Recibe oneInfo para filtrar por Patente si no lo incluye muestra la info de todos los vehi
            })
        }
    }

    async login(account){
        await logginMinexus(this.page, account)
    }
    
    async personalInfoCheck(account, dni){
        this.requestAnalizer('trabajadores', account, dni)
        console.log('... Descargando informacion de los empleados. ⏱')
        await navigateMinexus(this.page,'empleados')
    }
    async vehiculosInfoCheck(account, patente){
        this.requestAnalizer('vehiculos', account, patente)
        console.log('... Descargando informacion de los Vehiculos. ⏱')
        await navigateMinexus(this.page,'vehiculos')
    }

    async close() {
        await this.browser.close();
    }
}

module.exports = {
    MinexusBot
}


