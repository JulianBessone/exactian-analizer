
const venom = require('venom-bot')
const fs = require('fs')
const path = require('path')
const { ExactianBot} = require('./puppeteer.js')

const venomBot = () =>{
	const sessionStates = {};
	
	venom.create({
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
	
		await client.onMessage(async (message) => {
			const user = message.from;
			const userState = sessionStates[user] || {};
	
			if(message.body === 'Info empleados') {
				const exactianBot = new ExactianBot()
				await exactianBot.launch()
				await exactianBot.login()
				await exactianBot.navegate('generalDocu')
				await exactianBot.getInfoEmployee(client, user)
				await exactianBot.close()
			}
			if (message.body === 'Cargar documentación') {
				userState.step = 1;
				  sessionStates[user] = userState;
	
				await client.sendText(message.from, 'Dime que documentación es, recuerda que debes decirme tal cual como es solicitada en Exactian');
			} else{
				switch (userState.step) {
					case 1:
						userState.documentType = message.body;
						userState.step = 2;
						await client.sendText(user, `Ahora, De qué periodo es el documento "${userState.documentType}"? Recuerda que el formato de fecha es: *mm-yyyy*`);
						break;
	
					case 2:
						userState.period = message.body;
						userState.step = 3;
						await client.sendText(user, `Dime a que persona implica o a que vehiculo aplica.\n *RECUERDA*:\n En las personas debes escribirlo en el siguiente formato: Apellido, nombre.\n En los Vehiculos debes escribirlo en el siguiente formato: Modelo, Patente`);
						break;
	
					case 3:
						userState.appliesTo = message.body;
						userState.step = 4;
						await client.sendText(user, `Ahora puedes enviarme la documentación en PDF o Foto`);
						break;
					
					case 4:
						if(message.mimetype === 'application/pdf' || message.mimetype === 'image/jpeg' || message.mimetype === 'image/png'){
	
							userState.step = 0; // Finalizar la conversación
							const media = await client.decryptFile(message);
							const ext = message.filename.split('.')[1]
							const fileName = `Documents/${userState.documentType}-${userState.appliesTo}-${userState.period}.${ext}`;
							const buffer = await client.decryptFile(message);
							fs.writeFile(fileName, buffer, (err) => {
								if (err) throw err;
								console.log(`Archivo guardado como ${fileName}`);
							})
	
							await client.sendText(user, `Archivo guardado correctamente`);
							const exactianBot = new ExactianBot()
							await exactianBot.launch()
							await exactianBot.login()
							await exactianBot.navegate('presentarDocu')
							await exactianBot.chargeData(userState.documentType, userState.period, userState.appliesTo, fileName)
							await exactianBot.close()
							break;
						}else{
							await client.sendText(user, `El archivo no es valido vuelve a intentarlo`);
						}
	
					default:
						break;
				}
				
				// Limpiar el estado
				//delete sessionStates[user];
			}
		});
	}
}

const venomCheckInfoContra = (excel) =>{
	venom.create({
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
		
		const exactianBot = new ExactianBot()
		await exactianBot.launch()
		await exactianBot.login()
		await exactianBot.navegate('generalDocu')
		await exactianBot.getInfoContra(client, `${group[0].id.user}@g.us`)
		await exactianBot.close()
		await client.close()
	}
}

const venomCheckInfoEmple = (excel) =>{
	venom.create({
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
		
		const exactianBot = new ExactianBot()
		await exactianBot.launch()
		await exactianBot.login()
		await exactianBot.navegate('generalDocu')
		await exactianBot.getInfoEmployee(client, `${group[0].id.user}@g.us`)
		await exactianBot.close()
		await client.close()
	}
}
const venomCheckInfoVehi = async () =>{
	venom.create({
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
		
		const exactianBot = new ExactianBot()
		await exactianBot.launch()
		await exactianBot.login()
		await exactianBot.navegate('generalDocu')
		await exactianBot.getInfoEmployee(client, `${group[0].id.user}@g.us`)
		await exactianBot.close()
		await client.close()
	}
	
}

module.exports = {
	venomBot,
	venomCheckInfoVehi,
	venomCheckInfoEmple,
	venomCheckInfoContra
}