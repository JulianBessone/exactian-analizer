
const puppeteer = require('puppeteer');
const { getDocContra } = require('./DataChecker/docContra.js')
const { getDocEmple } = require('./DataChecker/docEmple.js');
const { getDocVehi } = require('./DataChecker/docVehi');
const { logginExactian, navegationMenu, oldSiteComeBack } = require('./ExactianInterface/ExactianInterface');
const { notifyDocEmpleProblems } = require('./Notifications/notificationsDocu');
const { chargeData, chargeDataWpp } = require('./ChargeData/ChargeData');
const { writeExcel } = require('./Excels/writeExel.js');

//La funcion crea una instancia de puppeteer y recibe el cliente de WhatsApp, esto con el fin de enviar mensajes a un numero en especifico para avisar de que hay docu vencida o pendiente
class ExactianBot {
    constructor() {
        this.browser = null;
        this.page = null;
    }
    async launch() {
        this.browser = await puppeteer.launch({
             headless: false
             //args: [ '--proxy-server=178.169.139.180:8080']
        }); 
        this.page = await this.browser.newPage();
        await this.page.goto('https://ganfenglatam.exactian.solutions'); //Accedo a la web de exactian Ganfen 
    }

    async login() {
        await logginExactian(this.page) //Funcion para ingresar a la app.
    }

    async navegate(destiny){
        await navegationMenu(this.page, destiny)
    }

    async chargeData(typeDoc, period, appliesTo, fileName){
        await chargeDataWpp(this.page, typeDoc, period, appliesTo, fileName)
    }

    async getInfoContra(client, user){
        await this.page.waitForTimeout(5000)
        //TABLA DE INFORMACIÓN
        await this.page.waitForSelector('table#principal table table table tr')
        await this.page.waitForTimeout(2000)
        console.log('*********************/ INFORMACIÓN DESCARGADA /*************************')
        const table = await this.page.$$('table#principal table table table tr td div table')
        const tableDocContra = table[1]
        const docInfoContra = await getDocContra(tableDocContra, this.page)
    }

    async getInfoEmployee(client, user, excel){
        await this.page.waitForTimeout(5000)
        //TABLA DE INFORMACIÓN
        await this.page.waitForSelector('table#principal table table table tr')
        await this.page.waitForTimeout(2000)
        console.log('********************   INFORMACIÓN DESCARGADA  ***********************')
        console.log('... POR FAVOR ESPERA QUE SE PROCESE LA INFORMACIÓN')
        const table = await this.page.$$('table#principal table table table tr td div table')
        const tableDocEmple = table[2]

        const docInfoEmple = await getDocEmple(tableDocEmple,this.page)
        console.log('... INFORMACIÓN PROCESADA CORRECTAMENTE')
        if(excel){
            writeExcel(docInfoEmple)
            console.log('*****************   DATOS GUARDADOS EN EXCEL   ***********************')
        }
        else{
            await notifyDocEmpleProblems(client, user, docInfoEmple)
            console.log('*****************   DATOS ENVIADOS VIA WHATSAPP   ***********************')
        }
    }
    async getInfoVehi(client, user){
        console.log('h')
    }


    async close() {
        await this.browser.close();
    }
}

module.exports = {
    ExactianBot
}