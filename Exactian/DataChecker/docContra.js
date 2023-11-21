const getDocContra = async (tableDocContra, page) =>{
    //TABLA DE INFORMACIÓN DOCUMENTACIÓN CONTRATISTA
    const elementTableInDivDocContra = await tableDocContra.$$('tr')

    const docInfoContra = {}

    await page.waitForTimeout(2000)
    for (const tr of elementTableInDivDocContra) {
        const stateOfDoc = await tr.$('td:first-child')
        const textOfDoc = await tr.$('td:last-child')
        
        const docDescription = await page.evaluate(textOfDoc => textOfDoc.textContent, textOfDoc);


        const imgGreen = await stateOfDoc.$('img[src="images/verde.png"]')
        const imgYellow = await stateOfDoc.$('img[src="images/amarillo.png"]')
        const imgRed = await stateOfDoc.$('img[src="images/rojo.png"]')

        if(imgGreen){
            docInfoContra[docDescription] = 'Aprobado'
        }
        if(imgYellow){
            docInfoContra[docDescription] = 'Pendiente de Revisión'
        }
        if(imgRed){
            docInfoContra[docDescription] = 'No esta presentada'
        }
    }

    return docInfoContra
}

module.exports = {
    getDocContra
}
