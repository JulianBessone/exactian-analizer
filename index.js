const venom = require('venom-bot')

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

    console.log(group)
    await client.sendText(`${group[0].id.user}@g.us`,`MENSAJE DE PRUEBA`)
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