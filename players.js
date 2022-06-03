const discord = require('discord.js');
const client = new discord.Client();
const config = require('./config.json');
const fivem = require('fivem');

const srv = new fivem.Server(convert(config.fivem));

function convert(str1) {
    var h = str1.toString();
    var str = '';
    for(var n = 0; n < h.length; n += 2) {
        str += String.fromCharCode(parseInt(h.substr(n, 2), 16));
    }
    return str;
}

client.on('ready', () => {
    var names = srv.getCurrentPlayers();
    var number = srv.getPlayers();
    names.then(name => {
        number.then(num => {
            const playerName = name;

            var plName = playerName.map(function (names) {
                return names.name;
            });

            let totPl = client.channels.cache.get('739745383407812669');
            const data = new discord.MessageEmbed()
                .setColor('FFD700')
                .setTitle('Gooks Roleplay Player Total')
                .setAuthor('ZRX & ANDROMEDA')
                .setThumbnail('https://logodix.com/logo/1609871.png')
                .addFields(
                    { name: 'Total Player:', value: num},
                    { name: '\u200B', value: '\u200B'},
                    { name: 'Player Name:', value: plName}
                )
                .setTimestamp()
                .setFooter('This data will refreshed every 1 minutes');
            totPl.send(data).then(msg => {
                msg.delete({ timeout: 59000});
                plName == null;
                totPl = null;
                num = null;
            });
        });
    });
});

client.login(config.token);