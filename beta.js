const discord = require('discord.js');
const config = require('./config.json');
const package = require('./package.json');
var shell = require('./helper');
const FiveM = require('fivem');
const colors = require('colors');
const cron = require('node-cron');

const client = new discord.Client();
const srv = new FiveM.Server(convert(config.fivem));

client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} is ${colors.green(`ONLINE\n`)}`);

    client.user.setStatus('dnd');
    client.user.setActivity('ON-UPDATE');
});

cron.schedule('*/2 * * * *', () => {
    var commandList = [
        "node players.js"
    ]

    shell.series(commandList, function(err) {
        console.log(`${colors.red('WARNING!! AN ERROR IN PLAYERS.JS')}`);
    });
});

client.on('message', async message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ + /g);
    const command = args.shift().toLowerCase();
    const person = message.member;

    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;
});

function convert(str1) {
    var h = str1.toString();
    var str = '';
    for(var n = 0; n < h.length; n += 2) {
        str += String.fromCharCode(parseInt(h.substr(n, 2), 16));
    }
    return str;
}

client.login(config.token);