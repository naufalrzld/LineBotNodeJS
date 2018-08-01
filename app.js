const express = require('express');
const line = require('@line/bot-sdk');

const config = require('./config.json');

const app = express();

const PORT = process.env.PORT || 3000;

const configLine = {
    channelAccessToken: config.CHANNEL_ACCESS_TOKEN,
    channelSecret: config.CHANNEL_SECRET
};

// create LINE SDK client
const client = new line.Client(configLine);

app.get('/', function (req, res) {
    res.json('LINE BOT');
});

app.post('/webhook', line.middleware(configLine), (req, res) => {
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((e)=>{
        console.log(e);
    });
});

function handleEvent(event) {
    if(event.message.text === "hai"){
        const echo = { type: 'text', text: "Halo juga :)·" };
        return client.replyMessage(event.replyToken, echo);
    }

    const echo = { type: 'text', text: "Saya tidak mengerti, saya simpan dulu" };
    return client.replyMessage(event.replyToken, echo);
}

app.listen(PORT, function () {
    console.log('API berjalan pada PORT', PORT);
});