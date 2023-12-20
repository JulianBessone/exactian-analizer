const puppeteer = require('puppeteer');
const { getDocContra } = require('./DataChecker/docContra.js')
const { getDocEmple, getDocEmpleByName } = require('./DataChecker/docEmple.js');
const { getDocVehi, getDocVehiByPatent } = require('./DataChecker/docVehi');
const { logginExactian, navegationMenu, oldSiteComeBack } = require('./ExactianInterface/ExactianInterface');
const { notifyDocEmpleProblems, notifyDocVehiProblems, notifyDocContra } = require('../Notifications/notificationsDocu');
const { chargeData, chargeDataWpp } = require('./ChargeData/ChargeData');
const { writeExcel, writeExcelExactianEmployees } = require('../Excels/writeExel.js');

class ExactianBot {
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

    async login(account) {
        await logginExactian(this.page, account) //Funcion para ingresar a la app.
    }

    async navegate(destiny, account){
        await navegationMenu(this.page, destiny, account)
    }

    async chargeData(typeDoc, period, appliesTo, fileName){
        await chargeDataWpp(this.page, typeDoc, period, appliesTo, fileName)
    }

    async getInfoContra(client, user, excel){
        await this.page.waitForTimeout(5000)
        //TABLA DE INFORMACIÓN
        await this.page.waitForSelector('table#principal table table table tr')
        await this.page.waitForTimeout(2000)
        console.log('*********************/ INFORMACIÓN DESCARGADA /*************************')
        const table = await this.page.$$('table#principal table table table tr td div table')
        const tableDocContra = table[1]
        const docInfoContra = await getDocContra(tableDocContra, this.page)
        console.log(docInfoContra)
        if(excel){
            console.log('*****************   DATOS GUARDADOS EN EXCEL   ***********************')
        } else{
            await notifyDocContra(client, user, docInfoContra)
            console.log('*****************   DATOS ENVIADOS VIA WHATSAPP   ***********************')
        }
    }

    async getInfoEmployee(client, user, excel, nameEmployee, account){
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
            writeExcelExactianEmployees(docInfoEmple,account)
            console.log('*****************   DATOS GUARDADOS EN EXCEL   ***********************')
        } else if(nameEmployee){
            const emple = await getDocEmpleByName(docInfoEmple, nameEmployee)
            console.log(emple)
        }
        else{
            await notifyDocEmpleProblems(client, user, docInfoEmple)
            console.log('*****************   DATOS ENVIADOS VIA WHATSAPP   ***********************')
        }
    }

    async getInfoVehi(client, user, excel, patente){
        await this.page.waitForTimeout(5000)
        //TABLA DE INFORMACIÓN
        await this.page.waitForSelector('table#principal table table table tr')
        await this.page.waitForTimeout(2000)
        console.log('********************   INFORMACIÓN DESCARGADA  ***********************')
        console.log('... POR FAVOR ESPERA QUE SE PROCESE LA INFORMACIÓN')
        const table = await this.page.$$('table#principal table table table tr td div table')
        const tableDocVehi = table[3]

        const docInfoVehi = await getDocVehi(tableDocVehi,this.page)
        console.log('... INFORMACIÓN PROCESADA CORRECTAMENTE')
        if(excel){
            writeExcel(docInfoVehi)
            console.log('*****************   DATOS GUARDADOS EN EXCEL   ***********************')
        } else if(patente){
            const vehi = await getDocVehiByPatent(docInfoVehi, patente)
            console.log(vehi)
        }
        else{
            await notifyDocVehiProblems(client, user, docInfoVehi)
            console.log('*****************   DATOS ENVIADOS VIA WHATSAPP   ***********************')
        }
    }


    async close() {
        await this.browser.close();
    }
}

module.exports = {
    ExactianBot
}