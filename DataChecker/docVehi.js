const getDocVehi = async (tableDocVehi, page) =>{
    //TABLA DE INFORMACIÓN DOCUMENTACIÓN VEHICULOS
    const elementTableInDivDocVehi = await tableDocVehi.$$('tr')

    const docInfoVehi = [] //Creo un array donde guardaremos obj que representaran a un empleado

    await page.waitForTimeout(2000)

    let index = 0 //Crearemos un acumulador

    for (const tr of elementTableInDivDocVehi) {
        const stateOfDoc = await tr.$('td:first-child')
        const textOfDoc = await tr.$('td:last-child')
        

        const imgGreen = await stateOfDoc.$('img[src="images/verde.png"]')
        const imgYellow = await stateOfDoc.$('img[src="images/amarillo.png"]')
        const imgRed = await stateOfDoc.$('img[src="images/rojo.png"]')

        const docDescription = await page.evaluate(textOfDoc => textOfDoc.textContent, textOfDoc);//Obtengo el nombre del emple o de la docu

        if(!docDescription || docDescription === ' ' || docDescription === 'Correspondiente a clasificación: CAMIONETAS - TRANSPORTE DE PERSONAL'){
            console.log('esto es un separador')//Si no tiene nombre de docu o emple es un separador por ende termino la iteración de ese elemento 
        }else{
            if(!imgGreen && !imgYellow && !imgRed){
                //Si no tiene imagen es una persona
                //Agrego un objeto al array de empleados y le asigno la propiedad nombre con el valor del texto
                docInfoVehi.push({
                    nombre: `${docDescription}`
                })
                index++
            }
            //Aqui evaluo si la foto me indica su estado
            if(imgGreen){
                docInfoVehi[index-1][docDescription] = 'Aprobado'
            }
            if(imgYellow){
                docInfoVehi[index-1][docDescription] = 'Vencida'
            }
            if(imgRed){
                docInfoVehi[index-1][docDescription] = 'No esta presentada'
            }
        }
    }

    console.log(docInfoVehi)
    return docInfoVehi
}
module.exports = {
    getDocVehi
};