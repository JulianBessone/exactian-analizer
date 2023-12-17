const puppeteer = require('puppeteer')
const { logginMinexus, navigateMinexus } = require("./MinexusInterface/MinexusInterface");
const { responseAnalizerEmployees, responseAnalizerVehi } = require('./ResponseAnalizer/ResponseAnalizer');

class MinexusBot {
    constructor() {
        this.browser = null;
        this.page = null;
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
    async requestAnalizer(type){
        if(type === 'trabajadores'){
            this.page.on('response',async (response) =>{
                responseAnalizerEmployees(response)
            })
        }
        if(type === 'vehiculos'){
            this.page.on('response',async (response) =>{
                responseAnalizerVehi(response)
            })
        }
    }

    async login(account){
        await logginMinexus(this.page, account)
    }
    
    async personalInfoCheck(){
        this.requestAnalizer('trabajadores')
        await navigateMinexus(this.page,'empleados')
    }
    async vehiculosInfoCheck(){
        this.requestAnalizer('vehiculos')
        await navigateMinexus(this.page,'vehiculos')
    }

    async close() {
        await this.browser.close();
    }
}

module.exports = {
    MinexusBot
}


