const puppeteer = require('puppeteer')
const { logginMinexus } = require("./MinexusInterface/MinexusInterface");

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

    async login(account){
        await logginMinexus(this.page, account)
    }
    
    async close() {
        await this.browser.close();
    }
}

module.exports = {
    MinexusBot
}