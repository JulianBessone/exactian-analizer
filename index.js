const venom = require('venom-bot');
const fs = require('fs');
const path = require('path');
const { exactian } = require('./puppeteer.');

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

	client.onMessage(async (message) => {
		if (message.body === 'Cargar documentación') {
			await client.sendText(message.from, 'Dime que documentación es, recuerda que debes decirme tal cual como es solicitada en Exactian');
			client.onMessage(async (message) => {
			documentacion = message.body;
			await client.sendText(message.from, 'Ahora necesito que me digas a quien o a que recurso afecta, recuerda que en el caso de los vehiculos debes indicar modelo y patente');
			client.onMessage(async (message) => {
				resourceName = message.body;
				await client.sendText(message.from, 'Dime el periodo de la documentación a presentar recuerda que el formato es mm/yyyy');
				client.onMessage(async (message) => {
				period = message.body;
				await client.sendText(message.from, 'Ahora sí, envíame el documento a cargar');
				client.onMessage(async (message) => {
					if (message.mimetype) {
					const buffer = await client.decryptFile(message);
					const fileName = `${documentacion}-${resourceName}-${period}.${message.mimetype.split('/')[1]}`;
					const filePath = path.join(__dirname, 'Documents', fileName);
					fs.writeFile(filePath, buffer, (err) => {
						if (err) throw err;
						console.log(`Archivo ${fileName} guardado en Documents`);
					});
					} else {
					await client.sendText(message.from, 'No me enviaste un documento. Vuelve a empezar escribiendo "Cargar documentación"');
					}
				});
				});
			});
			});
		}
    });

    //exactian(client, group[0].id.user)
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
