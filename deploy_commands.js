import fetch from 'node-fetch';
import 'dotenv/config';


const client_id = process.env.CLIENT_ID;
const guild_id = process.env.GUILD_ID;
const bot_token = process.env.BOT_TOKEN;
const guild_command_url = `https://discord.com/api/v8/applications/${client_id}/guilds/${guild_id}/commands`;



async function create_slash_command(name, description) {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
        'Content-Type': 'application/json'
    };

    const command_json = {
        'name': name,
        'type': 1,
        'description': description,
    };

    // POST new command
    const response = await fetch(
        guild_command_url, { method: 'POST', headers: headers, body: JSON.stringify(command_json) });
    
    const data = await response.json();

    if (Object.values(data).includes(name)) {
        return console.log(`'${name}' command created successfully!`)
    } else { 
        return console.log('Something went wrong, command not created.')
    }
    };


async function list_registed_commands() {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
    };

    // Get list of commands from API
    const response = await fetch(
        guild_command_url, { method: 'GET', headers: headers });

    const data = await response.json();

    return console.log(data);
    
}

list_registed_commands()

