import fetch from 'node-fetch';
import 'dotenv/config';

const clientID = process.env.CLIENT_ID;
const api_url = 'https://discord.com/api/v8/';


export async function ping(discordPayload) {
    const interactionToken = discordPayload['d']['token'];
    const interactionID = discordPayload['d']['id'];
    const interactionRespondURL = api_url.concat(
        `interactions/${interactionID}/${interactionToken}/callback`);

    // type 4 is 'respond to interaction with a message'
    const pingJSON = {
        'type': 4,
        'data': {
            'content': 'Pong!',
        },
    };

    await fetch(interactionRespondURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pingJSON),
    });
}

export async function countdown(discordPayload) {
    const interactionToken = discordPayload['d']['token'];
    const interactionID = discordPayload['d']['id'];
    const interactionRespondURL = api_url.concat(
        `interactions/${interactionID}/${interactionToken}/callback`);
    // Different endpoint for sending follow up messages to an interaction.
    const interactionFollowupURL = api_url.concat(
        `webhooks/${clientID}/${interactionToken}`);


    const responseArray = ['3', '2', '1', 'PLAY!'];

    let count = 0;
    for (const msg of responseArray) {

        const countdownJSON = {
            'type': 4,
            'data': {
                'content': msg,
            },
        };

        // Original interaction response.
        if (count == 0) {
            await fetch(
                interactionRespondURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(countdownJSON) });

            count++;

            // Delay after each number called.
            await new Promise(resolve => setTimeout(
                resolve, 500,
            ));

        }
        else {

            // Follow up messages use a different JSON format to interaction
            // responses as well as different URL.
            const countdownFollowupJSON = {
                'content': msg,
            };

            await fetch(
                interactionFollowupURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(countdownFollowupJSON) });

            // Delay after each number called.
            await new Promise(resolve => setTimeout(
                resolve, 500,
            ));
        }
    }
}