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
    .then((result) => res.json(result));
});

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text
    });
}

app.listen(PORT, function () {
    console.log('API berjalan pada PORT', PORT);
});