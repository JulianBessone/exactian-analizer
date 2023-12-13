const puppeteer = require('puppeteer')
const { logginMinexus, navigateMinexus } = require("./MinexusInterface/MinexusInterface");

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
        
        this.page.on('response',async (response) =>{
            if(response.url() === 'https://eramine.codin.minexus.net/proxy/staff?company=true') {
                const responseBody = await response.text();
                console.log(responseBody)
            }
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