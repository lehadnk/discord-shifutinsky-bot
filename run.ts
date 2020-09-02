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

    if (!permissionList.isPermitted(msg.channel.id)) {
        console.log('Not permitted: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
        return;
    } else {
        console.log('Permitted: ' + channel.id + '(' + msg.guild.name + ' - ' + channel.name + ')');
    }

    if (blocker.isBlocked(msg.guild.id)) {
        return;
    }

    if (containsRequest(msg.content)) {
        let song = SongFactory.getTodaySong();
        if (song === null) {
            await singer.sayNo(channel);
            return;
        }

        blocker.block(msg.guild.id);
        await singer.singInTextChannel(song.getText(), channel);
        blocker.unblock(msg.guild.id);
    }
});

permissionList.loadPermissions().then(() => {
    discordClient.login(process.env.DISCORD_BOT_TOKEN);
});