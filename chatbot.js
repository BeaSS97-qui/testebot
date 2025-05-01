// leitor de qr code
const qrcode = require('qrcode-terminal');
const { Client, Buttons, List, MessageMedia } = require('whatsapp-web.js'); // Mudança Buttons
const client = new Client();
// serviço de leitura do qr code
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});
// apos isso ele diz que foi tudo certo
client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});
// E inicializa tudo 
client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Função para enviar o menu principal
async function enviarMenu(from) {
    await client.sendMessage(from,
        `Agora me conta, quais das opções abaixo você quer saber mais:\n\n` +
        `1 - Me diga mais sobre cada modalidade\n` +
        `2 - Valores dos planos\n` +
        `3 - Onde o MUV fica?\n` +
        `4 - Como funcionam as aulas\n` +
        `5 - Me diga mais sobre as aulas express\n` +
        `6 - Grade de horários\n` +
        `7 - Quero agendar uma aula experimental`
    );
}

// Guarda em qual etapa cada chat está (feedback, menu, etc)
const chatState = {};

// Funil

client.on('message', async msg => {
    const from = msg.from;
    const body = msg.body && msg.body.trim();

     // Pergunta “já é aluna?”  
     if (chatState[from] === 'AWAIT_IS_STUDENT') {
        if (body === '1') {
            // Sim, já é aluna
            await msg.reply('Tudo bem, vou chamar alguém para te ajudar! 👩‍🏫');
        } else if (body === '2') {
            // Não é aluna → volta ao menu
            await msg.reply('Beleza! Então vamos lá:');
            await delay(3000);
            await enviarMenu(from);
        } else {
            await msg.reply('Responda 1 para Sim ou 2 para Não, por favor.');
            return;
        }
        chatState[from] = null;  // limpa estado
        return;
    }


    // Se estou aguardando feedback
    if (chatState[from] === 'AWAIT_FEEDBACK') {
        if (body === '1') {
            // Usuário respondeu “Sim”
            await msg.reply('Que ótimo que te ajudei! 🌟\n\nJá aproveita e garanta sua vaga na aula experimental:\nhttps://venda.nextfit.com.br/a31db459-d62f-4c15-9cfa-31118967d8de\n\nNos vemos em breve! 😉');
        } 
        else if (body === '2') {
            // Usuário respondeu “Não”
            await msg.reply('Tudo bem, vamos começar de novo então! 😉');
            await delay(1000);
            await enviarMenu(from);
            chatState[from] = null;
            return;
        } 
        else {
            await msg.reply('Por favor, responda 1 para Sim ou 2 para Não.');
            return;
        }
        // se chegou aqui, foi “Sim”
        chatState[from] = null;
        return; // não precisa chamar menu, pois já enviou o link
    }

     if (msg.body.match(/(bom dia|Bom dia|boa tarde|Boa tarde|boa noite|Boa noite|oie|Oie|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|Oioi, gostaria de saber sobre as aulas ❤️‍🔥✨)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await msg.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await client.sendMessage(msg.from,`Oioi, maravilhosa ${name.split(" ")[0]}! ❤️‍🔥✨\n\nQue delícia te ver por aqui! \n\nMeu nome é Muvelle, sou a assistente digital do Muv! \n\nAqui no Müv Studio, temos aulas de Pole Sport, Pole Coreográfico e Stiletto — cada uma com um jeitinho único de te fazer brilhar!\n\nAqui trabalhamos com dois formatos de aula:\n\nPadrão: 60 minutos de duração\nExpress: 40 minutos de duração`); //Primeira mensagem de texto
  
        // nova pergunta antes do menu
        await delay(2000);
        await (await msg.getChat()).sendStateTyping();
        await delay(2000);
        await msg.reply('Me diz aí, você já é nossa aluna?\n' + '1 - Sim\n' + '2 - Não' );
        chatState[from] = 'AWAIT_IS_STUDENT';
        return;
        

        
    }




    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '👉 Pole Sport: Focado em força, resistência e técnica, com giros e combos de figuras.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '👉 Pole Sensual: Movimentos mais fluidos, explorando a sensualidade, transições suaves e floorwork.');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '👉 Stiletto: Dança poderosa com saltos, atitude e presença. Muito chão, batidas marcadas e aquele toque de diva!');

        
        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;

    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Mensal Pole Dance:* 1x na semana R$ R$ 219,99 por mês.\n 2x na semana R$  R$ 395,98');

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Mensal Stiletto:* 1x na semana R$ R$ 189,99 por mês.\n 2x na semana R$  R$ 345,98');

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Semestral:* 1x na semana R$ R$ 178,99 por mês.\n 2x na semana R$  R$ 325,98 \n\n No plano semestral, você pode aproveitar as duas modalidades, tanto o pole dance quanto o stiletto!');

        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;

    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Ficamos na Rua Marechal Floriano Peixoto, próximo ao Geronimo West Music e o Colégio Liceu Cuiabano');
        

        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;
    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Cada aula dura 60 minutinhos de puro empoderamento: começamos com um aquecimento pra preparar o corpo, depois seguimos para a prática (com até 6 maravilhosas no pole ou 15 no stiletto) e fechamos com um alongamento relaxante. Aqui, a proximidade e o carinho são tudo: cada detalhe é pensado pra você se sentir apoiada e confiante do início ao fim!');


        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;


    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'As nossas Aulas Express possuem 40 minutinhos, mas você não perde nadinha da qualidade: aquecimento, prática e alongamento, tudo pensado pra maximizar seu treino. Turmas de Pole Sport e Pole Sensual com até 6 maravilhosas por aula, garantindo atenção total.');

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Disponível apenas no plano semestral por apenas R$ 149,99/mês (1x/semana) ou R$ 269,99/mês (2x/semana).');
    
        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;


    }

    if (msg.body !== null && msg.body === '6' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Tudo bem. Segue abaixo nossa grade de horários!!');
        
        // envia imagem local
        const media = MessageMedia.fromFilePath('grade.jpeg');     
        await client.sendMessage(msg.from, media, { caption: 'Müv Studio te espera! 👠' });

        // **PERGUNTA DE FEEDBACK**
        await delay(3000); 
        await chat.sendStateTyping(); 
        await delay(3000);
        await msg.reply('Respondi sua dúvida?\n' + '1 - Sim\n' + '2 - Não');
        chatState[from] = 'AWAIT_FEEDBACK';
        return;

    }

    if (msg.body !== null && msg.body === '7' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Ai que tudooooo!!');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Segue o link de agendamento da aula experimental, para poder conhecer mais sobre o estúdio e as aulas: https://venda.nextfit.com.br/a31db459-d62f-4c15-9cfa-31118967d8de');

        chatState[msg.from] = null; // Encerrando o chat
        return;

    }








});