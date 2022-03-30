import fetch from 'node-fetch';
import 'dotenv/config';


const client_id = process.env.CLIENT_ID;
const guild_id = process.env.GUILD_ID;
const bot_token = process.env.BOT_TOKEN;
const api_url = 'https://discord.com/api/';


async function createSlashCommand(name, description) {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
        'Content-Type': 'application/json',
    };

    const command_json = {
        'name': name,
        'type': 1,
        'description': description,
    };

    const guild_command_url = api_url.concat(
        `v8/applications/${client_id}/guilds/${guild_id}/commands`);

    // POST for new command
    const response = await fetch(
        guild_command_url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(command_json) });

    const data = await response.json();

    if (Object.values(data).includes(name)) {
        return console.log(`'${name}' command created successfully!`);
    }
    else {
        return console.log('Something went wrong, command not created.');
    }
}

async function getRegisteredCommands() {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
    };

    const guild_command_url = api_url.concat(
        `v8/applications/${client_id}/guilds/${guild_id}/commands`);

    // GET for list of commands from API
    const response = await fetch(
        guild_command_url, { method: 'GET', headers: headers });

    const data = await response.json();

    return data;

}

async function listRegisteredCommands() {
    const commands = await getRegisteredCommands();
    console.log(commands);
}