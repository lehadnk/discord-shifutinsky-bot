import {config as dotenvInit} from 'dotenv';
import {Client, TextChannel, VoiceChannel} from "discord.js";
import {Blocker} from "./src/Blocker";
import {Singer} from "./src/Singer";
import {SongFactory} from "./src/Songs/SongFactory";
import PermittedChannelList from "./src/PermittedChannelList";
import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {Database} from "sqlite3";

dotenvInit();

const blocker = new Blocker();
const singer = new Singer();

let databaseFile = './db.db3';
let db = new Database(databaseFile);
this.db = new SqliteDbAdapter(db);

const permissionList = new PermittedChannelList(this.db);

function containsRequest(msg: string): boolean {
    if (msg == '<@!1015611373645987861> Спойте, Михаил!') {
        return true;
    }

    if (msg == '<@!1015611373645987861> Маэстро, будьте добры!') {
        return true;
    }

    if (msg == '<@!1015611373645987861> Михаил, давайте нашу любимую!') {
        return true;
    }

    if (msg == '<@1015611373645987861> Спойте, Михаил!') {
        return true;
    }

    if (msg == '<@1015611373645987861> Михаил, ну без вас здесь никак') {
        return true;
    }

    if (msg == '<@!1015611373645987861> Михаил, ну без вас здесь никак') {
        return true;
    }

    if (msg == '<@1015611373645987861> Маэстро, будьте добры!') {
        return true;
    }

    if (msg == '<@1015611373645987861> Михаил, давайте нашу любимую!') {
        return true;
    }

    return false;
}

let discordClient = new Client();
discordClient.on("message", async msg => {
    if (msg.author.bot) {
        return;
    }

    if (msg.author.id === '207169330549358592' && msg.channel.type === "dm" && msg.content.match(/^\/базар .*$/)) {
        let msgData = msg.content.split(' ');
        if (msgData.length < 4) {
            return;
        }

        let command = msgData.splice(0, 1).join();
        let channelId = msgData.splice(0, 1).join();
        let playerId = msgData.splice(0, 1).join();
        let message = msgData.join(' ');

        let cn: TextChannel;
        // @ts-ignore
        cn = discordClient.channels.get(channelId);
        cn.send('<@' + playerId + '> ' + message).catch(r => console.log('Unable to send to channel: ' + r));
        return;
    }

    if (msg.channel.type === "dm" && msg.content.match(/^\/пригласить .*$/)) {
        let msgData = msg.content.split(' ');
        if (msgData.length < 2) {
            return;
        }

        let command = msgData.splice(0, 1).join();
        let channelId = msgData.splice(0, 1).join();

        await permissionList.addPermission(channelId, msg.author.id, msg.author.username + '#' + msg.author.discriminator);
        await msg.channel.send("Конечно, господа. Приглашайте, - с удовольствием спою и у вас!");
    }

    if (msg.channel.type != 'text') {
        return;
    }

    let channel: TextChannel;
    // @ts-ignore
    channel = msg.channel;

    if (!permissionList.isPermitted(msg.channel.id)) {
        console.log('Not permitted: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        return;
    }

    if (!containsRequest(msg.content)) {
        let prefix = msg.content.includes('618408394247634946') ? '!!!!!!!!!!!' : '';
        console.log(prefix + 'Does not contain request - skipping: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ') - ' + msg.author.id + '(' + msg.author.username + '): ' + msg.content);
        return;
    }

    if (blocker.isBlocked(msg.guild.id)) {
        console.log('Request is blocked: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        return;
    }

    let song = SongFactory.getTodaySong();
    if (song === null) {
        console.log('Saying no: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        await singer.sayNo(channel);
        return;
    }

    blocker.block(msg.guild.id);
    await singer.singInTextChannel(song.getText(), channel).catch((r) => {
        console.error(r);
        blocker.unblock(msg.guild.id);
    });
    blocker.unblock(msg.guild.id);
});

permissionList.loadPermissions().then(() => {
    discordClient.login(process.env.DISCORD_BOT_TOKEN);
});
