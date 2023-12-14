const puppeteer = require('puppeteer')
const { logginMinexus, navigateMinexus } = require("./MinexusInterface/MinexusInterface");
const { responseAnalizer } = require('./ResponseAnalizer/ResponseAnalizer');

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

        //Analizaremos las response request del navegador
        this.page.on('response',async (response) =>{
            responseAnalizer(response)
        })

        await this.page.goto(account.url ||'https://ganfenglatam.exactian.solutions'); //Accedo a la web de exactian Ganfen 
    }

    async login(account){
        await logginMinexus(this.page, account)
    }
    
    async personalInfoCheck(){
        await navigateMinexus(this.page,'empleados')
    }

    async close() {
        await this.browser.close();
    }
}

module.exports = {
    MinexusBot
}


