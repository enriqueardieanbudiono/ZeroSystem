const { Client, Intents } = require('discord.js');
const colors = require('colors');
const config = require('./config.json');
const package = require('./package.json');

const fs = require('fs');
const music = require('@koenie06/discord.js-music');
const events = music.event;

var cron = require('node-cron');
var shell = require('./helper');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });
module.exports.client = client;

// Level System
//const fs = require('fs');
//let db = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

events.on('playSong', async (channel, songInfo, requester) => {
    channel.send({
        content: `Started playing: [${songInfo.title}](${songInfo.url}) by ${songInfo.author}
        Requested by: ${requester.username}`
    });
});

events.on('addSong', async (channel, songInfo, requester) => { 
    channel.send({
        content: `Added: [${songInfo.title}](${songInfo.url}) by ${songInfo.author}
        Added by: ${requester.username}`
    });
});

events.on('playList', async (channel, playlist, songInfo, requester) => {

    /* See all the 'songInfo' and 'playlist' options by logging it.. */

    channel.send({
        content: `Started playing the song [${songInfo.title}](${songInfo.url}) by \`${songInfo.author}\` of the playlist ${playlist.title}.
        This was requested by ${requester.tag} (${requester.id})`
    });

});

events.on('addList', async (channel, playlist, requester) => {

    /* See all the 'playlist' options by logging it.. */

    channel.send({
        content: `Added the playlist [${playlist.title}](${playlist.url}) with ${playlist.videos.length} amount of videos to the queue.
        Added by ${requester.tag} (${requester.id})`
    });

});

events.on('finish', async (channel) => {

    channel.send({
        content: 'Party has been ended!'
    });

});

client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} is ${colors.green(`ONLINE\n`)}`);
    client.user.setActivity("This Server", {type: "LISTENING"});
});

client.on('interactionCreate', async (interaction) => {
    if(interaction.isCommand()) {
        if(interaction.commandName === 'play') {
            const channel = interaction.member.voice.channel;
            const song = interaction.options.getString('song');

            music.play({
                interaction: interaction,
                channel: channel,
                song: song
            });
        }

        if(interaction.commandName === 'stop') {
            music.stop({interaction: interaction});
        }

        if(interaction.commandName === 'skip') {
            music.skip({interaction: interaction});
        }

        if(interaction.commandName === 'pause') {
            music.pause({interaction: interaction});
        }

        if(interaction.commandName === 'resume') {
            music.resume({interaction: interaction});
        }

        if(interaction.commandName === 'repeat') {
            const OnOrOff = interaction.options.getBoolean('OnOrOff');

            music.repeat({
                interaction: interaction,
                value: OnOrOff
            });
        }

        if(interaction.commandName === 'volume') {
            const volume = interaction.options.getInteger('volume');

            music.volume({
                interaction: interaction,
                value: volume
            });
        }

        if(interaction.commandName === 'getqueue') {
            console.log(music.getQueue({interaction: interaction}));
        }

        if(interaction.commandName === 'removequeue') {
            const number = interaction.options.getInteger('number');

            music.removeQueue({
                interaction: interaction,
                number: number
            });
        }

        if(interaction.commandName === 'isconnected') {

            /*
             * This function returns a boolean whenever it is connected or not.
             * 'true' means that it is connected to a VoiceChannel.
             * 'false' means that it isn't connected to any VoiceChannel.
            */

            const isConnected = await music.isConnected({ interaction: interaction });
    
            interaction.reply({ content: isConnected === true ? 'I am connected!' : 'Welp.. I am not connected to any channel here.' });

        }

        if(interaction.commandName === 'ispaused') {

            /*
             * This function returns a boolean whenever it is paused or not.
             * 'true' means that the playing song is paused.
             * 'false' means that the playing song is still playing.
            */

            const isPaused = await music.isPaused({ interaction: interaction });
    
            interaction.reply({ content: isPaused === true ? 'I am waiting for you to resume..' : 'Yes yes, i am still playing music!' });

        }

        if(interaction.commandName === 'isresumed') {

            /*
             * This function returns a boolean whenever it is resumed or not.
             * 'true' means that the playing song is still playing.
             * 'false' means that the song is paused.
            */

            const isResumed = await music.isResumed({ interaction: interaction });
    
            interaction.reply({ content: isResumed === true ? 'Ofcourse i am still playing music!' : 'Sadly enough.. I got paused.' });

        };

        if(interaction.commandName === 'isrepeated') {

            /*
             * This function returns a boolean whenever it is resumed or not.
             * 'true' means that the playing song is on repeat.
             * 'false' means that the queue is just playing normally.
            */

            const isRepeated = await music.isRepeated({ interaction: interaction });
    
            interaction.reply({ content: isRepeated === true ? 'This song is in a infinite loop!' : 'Just playing the queue normally.' });

        };
    }
});

client.on('message', async message => {
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const person = message.member;

    if(message.author.bot) return;
    if(message.content.indexOf(config.prefix) !== 0) return;

    // ^Ping
    if(command === "ping") {
        message.channel.bulkDelete(1);
        const m = await message.channel.send("Ping?");
        m.edit(`Your Latency is **${m.createdTimestamp - message.createdTimestamp}ms**`);
    }

    // ^purge
    if(command === "purge") {
        if(!person.hasPermission('ADMINISTRATOR')) {
            message.channel.bulkDelete(1);
            message.channel.send(`${message.author}, You did not have permision to use this command!`);
            console.log(`${colors.red(`${message.author} is trying to use purge command`)}`);
        }
        else {
            const delCount = parseInt(args[0], 10);
            if(!delCount || delCount == 0 || delCount >= 100) {
                return message.reply("Please provide a number between 1 & 100 when you using the command.");
            }
            
            const fetch = await message.channel.messages.fetch({ limit: delCount + 1});
            message.channel.bulkDelete(fetch).catch(err => message.reply(`Could not delete the messages because of : ${err}`));

            if(delCount == 1) {
                console.log(`${colors.green(`${message.author} just purge ` + delCount + ` message!`)}`);
            }
            else {
                console.log(`${colors.green(`${message.author} just purge ` + delCount + ` messages!`)}`);
            }
        }
    }

    if(command === "say") {
        if(!person.roles.cache.has('931936333117653063')) {
            message.channel.bulkDelete(1);
            console.log(`${colors.red(`${message.author} is trying to use command say!`)}`);
            return message.author.send(`${message.author}, you did not have permissions to use that command in this server!`);
        }
        else {
            const sayMessage = args.join(" ");
            message.delete().catch(O_o => {});
            if(!sayMessage) {
                message.channel.bulkDelete(1);
                message.author.send("**This command need some sentences that it will sent to that channel!**");
            }
            else {
                message.channel.send(sayMessage);
                console.log(`${colors.green(`${message.author} just use say command => `)}` + sayMessage + "\n\n");
            }
        }
    }

    if(command === "help") {
        message.channel.bulkDelete(1);
        console.log(`${colors.green(`${message.author} just use help command`)}`);
        message.author.send(`Thank you for using **ZeroSystem**!!, for Problem that you occur at the server, please go to: <#574699796443561997> to see if your problem is listed there. If not, please put your questions in <#927055174197977098>`);
    }

    /* Level System
   // if the user is not on db add the user and change his values to 0
   if(!db[message.author.id]) {
       db[message.author.id] = {
           xp: 0,
           level: 0
       };
   }
   db[message.author.id].xp++;
   let userInfo = db[message.author.id];
   if(userInfo.xp > 100) {
       userInfo.level++
       userInfo.xp = 0
       message.reply("Congratulations, you level up to " + level)
   }
   
   if(command === "level") {
       message.channel.bulkDelete(1);
       let userInfo = db[message.author.id];
       let member = message.mentions.members.first();
       let embed = new discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle('Level System')
            .setAuthor('GRID')
            .setThumbnail('https://i.imgur.com/zCtL1Ts.png')
            .addField("Name", message.author)
            .addField("Level", userInfo.level)
            .addField("XP", userInfo.xp + "/100");
        if(!member) return message.channel.send(embed)
        let memberInfo = db[member.id]
        let embed2 = new discord.MessageEmbed()
            .setColor('0x4286f4')
            .setTitle('Level System')
            .setAuthor('GRID')
            .setThumbnail('https://i.imgur.com/zCtL1Ts.png')
            .addField("Name", message.author)
            .addField("Level", memberInfo.level)
            .addField("XP", memberInfo.xp + "/100")
        message.channel.send(embed2)
   }
   fs.writeFile("./database.json", JSON.stringify(db), (x) => {
       if(x) console.error(x);
   }); */
});

process.on('unhandledRejection', (reaction, promise) => {
    //
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