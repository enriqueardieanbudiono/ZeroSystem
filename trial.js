const discord = require('discord.js');
const colors = require('colors');
const config = require('./config.json');
const package = require('./package.json');

const client = new discord.Client();

const FiveM = require('fivem');
const srv = new FiveM.Server(config.fivem);

client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} is ${colors.green(`ONLINE`)}`);
    try {
        setInterval(function start() {
            const tot = srv.getPlayers();
            tot.then(playerCount => {
                if(playerCount <= 1) {
                    var stat1 = [`CREATED BY 🌌`, playerCount + "/64 Player"]
                    var rand1 = stat1[Math.floor(Math.random() * stat1.length)];
                    client.user.setActivity(`${rand1}`, { type: 'WATCHING'});
                }
                else {
                    var stat2 = [`CREATED BY 🌌`, playerCount + "/64 Players"]
                    var rand2 = stat2[Math.floor(Math.random() * stat2.length)];
                    client.user.setActivity(`${rand2}`, { type: 'WATCHING'});
                }
            });

            return start;
        }, 1500);
    }
    catch(e) {
        console.log(e);
    }
});

client.on('message', async message => {
    const args = message.content.slice(config.prefix2.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const person = message.member;

    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix2) !== 0) return;

    if(command === "players") {
        message.channel.bulkDelete(1);
        if(!person.hasPermission('ADMINISTRATOR')) {
            console.log(`${colors.red(`${message.author} is trying to use players command!`)}`);
            return message.channel.send(`**Hei ${message.author}, You did not have permissions to use this command!`);
        }
        else {
            const data = srv.getCurrentPlayers();
            data.then(names => {
                console.log(names);
            });
            console.log(`${colors.green(`${message.author} just use players command!`)}`);
        }
    }
});

process.on('unhandledRejection', (reaction, promise) => {
    //
});

client.login(config.test);