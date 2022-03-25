import fetch from 'node-fetch';
import 'dotenv/config';
import WebSocket from 'ws';

const bot_token = process.env.BOT_TOKEN;
const apiUrl = 'https://discord.com/api';
const headers = {
    'Authorization': `Bot ${bot_token}`,
};

async function getWebsocketGateway() {

    // does not require bot authorization
    const gatewayGetUrl = apiUrl.concat('/gateway');
    const response = await fetch(gatewayGetUrl);
    const data = await response.json();

    const gatewayUrl = data['url'];

    // returns promise which will need to be accessed by using .then()
    return gatewayUrl;
}


async function initializeWebSocket() {

    const gatewayUrl = await getWebsocketGateway();
    const versionEncoding = '/?v=9&encoding=json';

    const connectionUrl = gatewayUrl.concat(versionEncoding);

    const ws = new WebSocket(connectionUrl);

    ws.on('open', function () {
        console.log('Connection established')
    });

    ws.on('message', function checkMessageType(data) {
        console.log('received: %s', data);

        const discordPayload = JSON.parse(data); 

        // gateway 'hello'
        if (discordPayload['op'] == 10) { 
            const heartbeatInterval = 
            discordPayload['d']['heartbeat_interval'];
            // wait interval * jitter before sending a heartbeat to discord.
            await new Promise(resolve => setTimeout(
                resolve, heartbeatInterval*0.1));
            
            
            setInterval(function heartbeat(){ 
                ws.send()
                heartbeatInterval})
            
    
            
        }
        // gateway requests heartbeat
        if (discordPayload['op'] == 1) {
            // send heartbeat
        }
        // gateway acknowledges heartbeat
        if (discordPayload['op'] == 11) {
            // console.log the heartbeat
        }

        
    });
}


function debug() { 
    const my_json = {
        t: null,
        s: null,
        op: 10,
        d: {
          heartbeat_interval: 41250,
          _trace: [ '["gateway-prd-main-lrzk",{"micros":0.0}]' ]
        }
      }

    
    console.log(my_json['d']['heartbeat_interval'])

    if (my_json['op'] == 10) { 
        console.log('hello')
    }
    
}

debug()