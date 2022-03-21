import fetch from 'node-fetch';
import 'dotenv/config';
import express from 'express';

const bot_token = process.env.BOT_TOKEN;
const url = 'https://discord.com/api/oauth2/applications/@me';
const headers = {
    'Authorization': `Bot ${bot_token}`,
};

fetch(url, { method: 'GET', headers: headers })
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        console.log(json);
    });

