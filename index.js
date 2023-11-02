const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const { exactian } = require('./puppeteer.');

const sessionStates = {};

venom
  .create({
    session: 'EXACTIAN-CHAT', //name of session
    multidevice: true, // for version not multidevice use false.(default: true)
    headless: false
  })
  .then((client) => {start(client)})
  .catch((erro) => {
    console.log(erro);
  });

const start = async (client)=>{
    // Continuar con las operaciones que requieras, como obtener la lista de chats
    const chats = await client.getAllChatsGroups();
    const group = await chats.filter(c=>c.groupMetadata.subject === 'Cosas importar')

    await client.sendText(`${group[0].id.user}@g.us`,`MENSAJE DE PRUEBA`)

    let documentacion = '';
	let resourceName = '';
	let period = '';

	await client.onMessage(async (message) => {
		const user = message.from;
    	const userState = sessionStates[user] || {};


		if (message.body === 'Cargar documentación') {
			userState.step = 1;
      		sessionStates[user] = userState;

			await client.sendText(message.from, 'Dime que documentación es, recuerda que debes decirme tal cual como es solicitada en Exactian');
		} else{
			if (userState.step === 1) {

				userState.documentType = message.body;
				userState.step = 2;
				await client.sendText(user, `Ahora, De qué periodo es el documento "${userState.documentType}"? Recuerda que el formato de fecha es: *mm-yyyy*`);

			} else if (userState.step === 2){

				userState.period = message.body;
				userState.step = 3;
				await client.sendText(user, `Ahora puedes enviarme la documentación en PDF o Foto`);

			} else if (userState.step === 3 && (message.mimetype === 'application/pdf' || message.mimetype === 'image/jpeg' || message.mimetype === 'image/png')){
				
				userState.step = 0; // Finalizar la conversación
				const media = await client.decryptFile(message);
				const ext = message.filename.split('.')[1]
				const fileName = `Documents/${userState.documentType}-${userState.period}.${ext}`;
				const buffer = await client.decryptFile(message);
				fs.writeFile(fileName, buffer, (err) => {
					if (err) throw err;
					console.log(`Archivo guardado como ${fileName}`);
				})
				await client.sendText(user, `Archivo guardado correctamente`);
			}
			// Limpiar el estado
			delete sessionStates[user];
		}
    });
    //exactian(client, group[0].id.user)
}

// Crea una función para guardar archivos
function saveDocument(nameDocu, contentDocu) {

	// Define la ruta del archivo
	const directorioProyecto = __dirname;
	const docPath = directorioProyecto + nameDocu;
  
	// Escribe el archivo en el sistema de archivos
	fs.writeFile(docPath, contentDocu, (error) => {
	  if (error) {
		console.error('Error al guardar el archivo:', error);
	  } else {
		console.log('Archivo guardado exitosamente:', docPath);
	  }
	});
}

///FUNCION PARA ENVIAR MENSAJES

function sendMessageToWhatsapp(client, message, response) {
    return new Promise((resolve, reject) => { 
      client
      .sendText(message.from, response.text.text[0])
      .then((result) => {
        console.log('Result: ', result); //return object success
        resolve(result);
      })
      .catch((erro) => {
        console.error('Error when sending: ', erro);
        reject(erro)
      });
    });
}
