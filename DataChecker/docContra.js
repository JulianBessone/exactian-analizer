export const getDocContra = async (tableDocContra,page) =>{
    //TABLA DE INFORMACIÓN DOCUMENTACIÓN CONTRATISTA
    const elementTableInDivDocContra = await tableDocContra.$$('tr')

    const docInfoContraText = [] //Creo un array donde guardaremos a que docu pertenece cada sección
    const docInfoContraValue = [] //Creo un array donde guardaremos el estado cada docu


    await page.waitForTimeout(2000)
    for (const tr of elementTableInDivDocContra) {
        const stateOfDoc = await tr.$('td:first-child')
        const textOfDoc = await tr.$('td:last-child')
        

        const imgGreen = await stateOfDoc.$('img[src="images/verde.png"]')
        const imgYellow = await stateOfDoc.$('img[src="images/amarillo.png"]')
        const imgRed = await stateOfDoc.$('img[src="images/rojo.png"]')

        if(imgGreen){
            docInfoContraValue.push('Aprobado')
        }
        if(imgYellow){
            docInfoContraValue.push('Pendiente de Revisión')
        }
        if(imgRed){
            docInfoContraValue.push('No esta presentada')
        }
        const docDescription = await page.evaluate(textOfDoc => textOfDoc.textContent, textOfDoc);
        docInfoContraText.push(docDescription)
    }

    console.log(docInfoContraValue, docInfoContraText)
    return[docInfoContraValue,docInfoContraText]
}
