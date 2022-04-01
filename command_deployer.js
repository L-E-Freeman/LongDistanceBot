import fetch from 'node-fetch';
import 'dotenv/config';


const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;
const bot_token = process.env.BOT_TOKEN;
const api_url = 'https://discord.com/api/v8/';


async function createSlashCommand(name, description) {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
        'Content-Type': 'application/json',
    };

    const guildCommandURL = api_url.concat(
        `applications/${clientID}/guilds/${guildID}/commands`);

    const commandJSON = {
        'name': name,
        'type': 1,
        'description': description,
    };

    // POST for new command
    const response = await fetch(
        guildCommandURL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(commandJSON) });

    const data = await response.json();

    if (Object.values(data).includes(name)) {
        return console.log(`'${name}' command created successfully!`);
    }
    else {
        return console.log('Something went wrong, command not created.');
    }
}

async function deleteSlashCommand(commandName, commandID) {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
        'Content-Type': 'application/json',
    };

    const guildCommandURLDelete = api_url.concat(
        `applications/${clientID}/guilds/${guildID}/commands/${commandID}`,
    );

    const response = await fetch(
        guildCommandURLDelete, {
            method: 'DELETE',
            headers: headers,
        });

    // Discord returns 204 no content on success.
    if (response.status === 204) {
        console.log(`'${commandName}' command deleted successfully.`);
    }
    else {
        const data = await response.json();
        const err = JSON.stringify(data['message']);
        console.log(`Command not deleted. Error: ${err})`);
    }

}

async function getRegisteredCommands() {

    const headers = {
        'Authorization': `Bot ${bot_token}`,
    };

    const guild_command_url = api_url.concat(
        `applications/${clientID}/guilds/${guildID}/commands`);

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

