import fetch from 'node-fetch';
const api_url = 'https://discord.com/api/';

export async function ping(discordPayload) {
    const interactionToken = discordPayload['d']['token'];
    const interactionID = discordPayload['d']['id'];
    const interactionRespondURL = api_url.concat(
        `v8/interactions/${interactionID}/${interactionToken}/callback`);

    // type 4 is 'respond to interaction with a message'
    const pingJSON = {
        'type': 4,
        'data': {
            'content': 'Pong!',
        },
    };

    await fetch(interactionRespondURL, {
        method: 'POST',
        body: JSON.stringify(pingJSON),
        headers: { 'Content-Type': 'application/json' },
    });


}
