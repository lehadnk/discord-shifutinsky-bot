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
    if (msg == '<@!618408394247634946> Спойте, Михаил!') {
        return true;
    }

    if (msg == '<@!618408394247634946> Маэстро, будьте добры!') {
        return true;
    }

    if (msg == '<@!618408394247634946> Михаил, давайте нашу любимую!') {
        return true;
    }

    return false;
}

let discordClient = new Client();
discordClient.on("message", async msg => {
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

    if (!containsRequest(msg.content)) {
        console.log('Does not contain request - skipping: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + '): ' + msg.content);
        return;
    }

    if (blocker.isBlocked(msg.guild.id)) {
        console.log('Request is blocked: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        return;
    }

    if (!permissionList.isPermitted(msg.channel.id)) {
        console.log('Not permitted: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        return;
    } else {
        console.log('Permitted: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
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