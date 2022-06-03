const discord = require('discord.js');
const colors = require('colors');
const config = require('./config.json');
const package = require('./package.json');
var cron = require('node-cron');
var shell = require('./helper');
const client = new discord.Client();

//FiveM use only
//const FiveM = require('fivem');
//const srv = new FiveM.Server(convert(config.fivem));
//const test = new FiveM.Server(config.ZSW);

// Level System
//const fs = require('fs');
//let db = JSON.parse(fs.readFileSync('./database.json', 'utf-8'));

client.on('ready', async () => {
    console.clear();
    console.log(`${client.user.tag} is ${colors.green(`ONLINE\n`)}`);
    client.user.setActivity("This Server", {type: "WATCHING"});
    /*try {
        setInterval(function() {
            const tot = srv.getPlayers();
            tot.then(playerCount => {
                if(playerCount <= 1) {
                    client.user.setActivity(playerCount + "/64 Player", {type: "WATCHING"});
                }
                else {
                    client.user.setActivity(playerCount + "/64 Players", {type: "WATCHING"});
                }
            });
        }, 1500);
    }
    catch(e) {
        console.log(e);
    }  */
});

//cron.schedule('*/1 * * * *', () => {
//    var commandList = [
//        "node players.js"
//    ]
//
//    shell.series(commandList, function(err) {
//        console.log(`${colors.red('WARNING!! AN ERROR IN PLAYERS.JS')}`);
//    });
//});

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

    if(command === "players") {
        message.channel.bulkDelete(2);
        if(!person.hasPermission('ADMINISTRATOR')) {
            console.log(`${colors.red(`${message.author} is trying to use players command!`)}`);
            return message.channel.send(`**Hei ${message.author}, You did not have permissions to use this command!`);
        }
        else {
            const data = srv.getCurrentPlayers();
            data.then(names => {
                message.channel.send(JSON.stringify(names) + "\n\n");
                console.log(names);
            });
            console.log(`${colors.green(`${message.author} just use players command!`)}`);
        }
    }

    if(command === "help") {
        message.channel.bulkDelete(1);
        console.log(`${colors.green(`${message.author} just use help command`)}`);
        message.author.send(`Thank you for using **ZeroSystem**!!, for Problem that you occur at the server, please go to: <#574699796443561997> to see if your problem is listed there. If not, please put your questions in <#927055174197977098>`);
    }

    /*if(command === "bunker") {
        if(!person.roles.cache.has('743511468539904010')) {
            message.channel.bulkDelete(1);
            console.log(`${colors.red(`${message.author} is trying to use bunker command!`)}`);
            return message.author.send(`${message.author}, you did not have permission to use that command!`);
        }
        else {
            let bunker = client.channels.cache.get("746799983780560916");
            message.channel.bulkDelete(1);
            message.channel.send('Do you want to increase or decrease?\n**(I)** = Increase\n**(D)** = Decrease\n**__CHOOSE ONE__**');
            let filter = m => true;
            let counter = 0;
            let collector = new discord.MessageCollector(message.channel, filter);
            global.ID = "";
            global.item = "";
            global.W = 0;
            global.P = 0;
            global.C = 0;
            global.O = 0;
            global.H = 0;
            global.M = 0;
            global.number = 0;

            collector.on('collect', (message, col) => {
                counter++;

                if(counter == 2) {
                    ID = message.content;
                    message.channel.bulkDelete(2);
                    if(ID == 'I' || ID == 'increase' || ID == 'Increase' || ID == 'i') {
                        message.channel.send('What item do you want to add?\n**(W)** = Wetshroom\n**(P)** = Poppy\n**(C)** = Cannabis\n**(O)** = Opium\n**(H)** = Heroin\n**(M)** = Marijuana\n**__CHOOSE ONE__**');
                    }

                    else if(ID == 'D' || ID == 'decrease' || ID == 'Decrease' || ID == 'd') {
                        message.channel.send('What item do you want to decrease?\n**(W)** = Wetshroom\n**(P)** = Poppy\n**(C)** = Cannabis\n**(O)** = Opium\n**(H)** = Heroin\n**(M)** = Marijuana\n**__CHOOSE ONE__**');
                    }
                    else {
                        message.author.send(`${message.author}, you type the wrong command! Try again from the beginning.`);
                    }
                }

                if(counter == 4) {
                    item = message.content;
                    message.channel.bulkDelete(2);
                    if(item == 'W' || item == 'w') { // If user choose Wetshroom
                        if(ID == 'I' || ID == 'i') { // If user want to increase it
                            message.channel.send('How many **Wetshroom** you want to add?');
                        }
                        else if(ID == 'D' || ID == 'd') { // If user want to decrease it
                            if(W == 0) { // If Wetshroom is already 0
                                message.author.send(`${message.author}, I cannot decrease something that already gone.`);
                                collector.stop();
                            }
                            else {
                                message.channel.send('How many **Wethsroom** you want to decrease?');
                            }
                        }
                    }
                    else if(item == 'P' || item == 'p') { // If user choose Poppy
                        if(ID == 'I' || ID == 'i') { // If user want to increase it
                            message.channel.send('How many **Poppy** you want to add?');
                        }
                        else if(ID == 'D' || ID == 'd') { // If user want to decrease it
                            if(P == 0) { // If Poppy is already 0
                                message.author.send(`${message.author}, I cannot decrease something that already gone.`);
                                collector.stop();
                            }
                            else {
                                message.channel.send('How many **Poppy** you want to decrease?');
                            }
                        }
                    }
                    else if(item == 'C' || item == 'c') { // If User choose Cannabis
                        if(ID == 'I' || ID == 'i') {
                            message.channel.send('How many **Cannabis** you want to add?');
                        }
                        else if(ID == 'D' || ID == 'd') {
                            if(C == 0) { // If Cannabis is already 0
                                message.author.send(`${message.author}, I cannot decrease something that already gone.`);
                                collector.stop();
                            }
                            else {
                                message.channel.send('How many **Cannabis** you want to decrease?');
                            }
                        }
                    }
                    else if(item == 'O' || item == 'o') { // If user choose Opium
                        if(ID == 'I' || ID == 'i') {
                            message.channel.send('How many **Opium** you want to add?');
                        }
                        else if(ID == 'D' || ID == 'd') {
                            if(O == 0) {
                                message.author.send(`${message.author}, I cannot decrease something that already gone.`);
                                collector.stop();
                            }
                            else {
                                message.channel.send('How many **Cannabis** you want to decrease?');
                            }
                        }
                    }
                    else if(item == 'H' || item == 'h') {
                        if(ID == 'I' || ID == 'i') {
                            message.channel.send('How many **Heroin** you want to add?');
                        }
                        else if(ID == 'D' || ID == 'd') {
                            if(H == 0) {
                                message.author.send(`${message.author}, I cannot decrease something that already gone.`);
                                collector.stop();
                            }
                            else {
                                message.channel.send('How many **Heroin** you want to decrase?');
                            }
                        }
                    }
                }

                if(counter == 6) {
                    number == message.content;
                    message.channel.bulkDelete(2);
                    if(item == 'W' || item == 'w') {
                        if(ID == 'I' || item == 'i') {
                            W += number;
                        }
                        else if(ID == 'D' || item == 'd') {
                            W -= number;
                        }
                    }
                    else if(item == 'P' || item == 'p') {
                        if(ID == 'I' || ID == 'i') {
                            P += number;
                        }
                        else if(ID == 'D' || ID == 'd') {
                            P -= number;
                        }
                    }
                    else if(item == 'C' || item == 'c') {
                        if(ID == 'I' || ID == 'i') {
                            C += number;
                        }
                        else if(ID == 'D' || ID == 'd') {
                            C -= number;
                        }
                    }
                    else if(item == 'O' || item == 'o') {
                        if(ID == 'I' || ID == 'i') {
                            O += number;
                        }
                        else if(ID == 'D' || ID == 'd') {
                            O -= number;
                        }
                    }
                    else if(item == 'H' || item == 'h') {
                        if(ID == 'I' || ID == 'i') {
                            H += number;
                        }
                        else if(ID == 'D' || ID == 'd') {
                            H -= number;
                        }
                    }
                    collector.stop();
                }
            });

            collector.on('end', collected => {
                let bunker = client.channels.cache.get("747681022996512839");
                const data = new discord.MessageEmbed()
                    .setColor('#FF0000')
                    .setAuthor('BUNKER IN DARKSIDE')
                    .setThumbnail('https://i.imgur.com/V1RP7Jg.jpeg')
                    .addFields(
                        { name: '\u200B', value: '\u200B'},
                        { name: 'Wetshroom', value : W, inline: true},
                        { name: 'Poppy', value: P, inline: true},
                        { name: 'Cannabis', value: C, inline: true},
                        { name: 'Opium', value: O, inline: true},
                        { name: 'Heroin', value: H, inline: true},
                        { name: 'Marijuana', value: M, inline: true}
                    )
                    .setTimestamp()
                    .setFooter('BUNKER IN DARKSIDE', 'https://i.imgur.com/V1RP7Jg.jpeg');
                
                bunker.send(data).then(async message => {
                    await message.react("✅");
                    await message.react("❌");
                });
            });
        }
    }

    if(command === 'test') {
        message.channel.bulkDelete(1);
        if(person.roles.cache.has('743511468539904010')) {
            return message.author.send(`${message.author}, you already had this DARKSIDE role! You cannot take the test twice!`);
        }
        else {
            if(message.channel.id !== "747218989184450702") {
                message.author.send('You send the messages in the wrong place! Try it again after you read the instructions!');
            }
            else {
                message.author.send(`**TEST-101**\n\nWelcome in test-101. In this test you need to get __full point__ to pass the test.\n` + 
                                     `You will get **__5 questions__**. Each question worth **1 point**. It means that you need to get **5 points** to pass the test.\n\n` + 
                                     '**__YOU CANNOT GO BACK TO PREVIOUS QUESTION AFTER YOU PRESS ENTER__**\n\n' +
                                     '``GOOD LUCK!!``\n\n');
                let filter = m => true;
                let counter = 0;
                let collector = new discord.MessageCollector(message.channel, filter);
                global.Q1 = "";
                global.Q2 = "";
                global.Q3 = "";
                global.Q4 = "";
                global.Q5 = "";
                global.grade = 0;
                message.channel.send(`**Question 1**\nWhich one is the **MDMA** Formula\nA. C20H25N3O\nB. C11H15NO2\nC. C21H30O2`);

                collector.on('collect', (message, col) => {
                    counter++;

                    if(counter == 2) {
                        Q1 = message.content;
                        message.channel.bulkDelete(2);
                        if(Q1 == "A" || Q1 == "a") {
                            grade == grade;
                        }
                        else if(Q1 == "B" || Q1 == "b") {
                            grade++;
                        }
                        else if(Q1 == "C" || Q1 == "c") {
                            grade == grade;
                        }

                        message.channel.send('**Question 2**\nTo Create LSD, what item do you need to use?\nA. Heroin\nB. Shrooms\nC. All of Them');
                    }

                    if(counter == 4) {
                        Q2 = message.content;
                        message.channel.bulkDelete(2);
                        if(Q2 == "A" || Q2 == "a") {
                            grade == grade;
                        }
                        else if(Q2 == "B" || Q2 == "b") {
                            grade++;
                        }
                        else if(Q2 == "C" || Q2 == "c") {
                            grade == grade;
                        }

                        message.channel.send('**Question 3**\nFor this question, you need to ask ' + "<@293603378611748866>" + ' for the question.\n**WAITING.....**');
                    }

                    if(counter == 6) {
                        Q3 = message.content;
                        message.channel.bulkDelete(2);

                        if(Q3 !== "wpZgB7i2A") {
                            grade == grade;
                        }

                        else {
                            grade++;
                        }

                        message.channel.send('**Question 4**\nWhen processing **__Poppy__** to **__Opium__**, how many minutes do you need to process 50 **poppy**?\nA. ± 5 minutes\nB. ± 7 minutes\nC. ± 9 minutes');
                    }

                    if(counter == 8) {
                        Q4 = message.content;
                        message.channel.bulkDelete(2);
                        if(Q4 == "A" || Q4 == "a") {
                            grade++;
                        }
                        else if(Q4 == "B" || Q4 == "b") {
                            grade == grade;
                        }
                        else if(Q4 == "C" || Q4 == "c") {
                            grade == grade;
                        }

                        message.channel.send('**Question 5**\nWhat is the international nonproprietary name for **Cannabis**?\nA. dronabinol\nB. Lysergide\nC. Midomafetamine');
                    }

                    if(counter == 10) {
                        Q5 = message.content;
                        message.channel.bulkDelete(2);
                        if(Q5 == "A" || Q5 == "a") {
                            grade++;
                        }
                        else if(Q5 == "B" || Q5 == "b") {
                            grade == grade;
                        }
                        else if(Q5 == "C" || Q5 == "c") {
                            grade == grade;
                        }

                        collector.stop();
                    }
                });

                collector.on('end', collected => {
                    if(grade == "5") {
                        message.author.send(`**Congratulations!!** You passed the Test. WELCOME TO THE DARKSIDE, ${message.author}.`);

                        let darkside = message.guild.roles.cache.get('743511468539904010');
                        let black = message.guild.roles.cache.get('752301017831440455');
                        let member = message.member;

                        member.roles.add(darkside).catch(console.error);
                        member.roles.add(black).catch(console.error);

                        console.log(`${message.author} just got DARKSIDE Role`);
                    }
                    else {
                        message.author.send(`Sorry, you did not pass the test, you are too pure ${message.author}.\n` + `You only got ` + grade + ' Point(s)');
                    }
                });
            }
        }
    } */

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