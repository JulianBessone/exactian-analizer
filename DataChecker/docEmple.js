const getDocEmple = async (tableDocEmple, page) =>{
    //TABLA DE INFORMACIÓN DOCUMENTACIÓN EMPLEADOS
    const elementTableInDivDocEmple = await tableDocEmple.$$('tr')

    const docInfoEmple = [] //Creo un array donde guardaremos obj que representaran a un empleado

    await page.waitForTimeout(2000)

    let index = 0 //Crearemos un acumulador

    for (const tr of elementTableInDivDocEmple) {
        const stateOfDoc = await tr.$('td:first-child')
        const textOfDoc = await tr.$('td:last-child')
        

        const imgGreen = await stateOfDoc.$('img[src="images/verde.png"]')
        const imgYellow = await stateOfDoc.$('img[src="images/amarillo.png"]')
        const imgRed = await stateOfDoc.$('img[src="images/rojo.png"]')

        const docDescription = await page.evaluate(textOfDoc => textOfDoc.textContent, textOfDoc);//Obtengo el nombre del emple o de la docu

        if(!docDescription){
            console.log('esto es un separador') //Si no tiene nombre de docu o emple es un separador por ende termino la iteración de ese elemento 
        }else{
            if(!imgGreen && !imgYellow && !imgRed){
                //Si no tiene imagen es una persona
                //Agrego un objeto al array de empleados y le asigno la propiedad nombre con el valor del texto
                docInfoEmple.push({
                    nombre: `${docDescription}`
                })
                index++
            }
            //Aqui evaluo si la foto me indica si esta aprobada
            if(imgGreen){
                docInfoEmple[index-1][docDescription] = 'Aprobado'
            }
            if(imgYellow){
                docInfoEmple[index-1][docDescription] = 'Pendiente de Revisión'
            }
            if(imgRed){
                docInfoEmple[index-1][docDescription] = 'No esta presentada'
            }
        }
    }

    console.log(docInfoEmple)
    return docInfoEmple
}

module.exports = {
    getDocEmple
};