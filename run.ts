import {config as dotenvInit} from 'dotenv';
import {Client, TextChannel, VoiceChannel} from "discord.js";
import {Blocker} from "./src/Blocker";
import {Singer} from "./src/Singer";
import {SongFactory} from "./src/Songs/SongFactory";

dotenvInit();

const blocker = new Blocker();
const singer = new Singer();
const permittedChannels = new Map<string, string>();
permittedChannels.set('207912188407578624', '211650891336515585');
permittedChannels.set('203632333620772874', '203632333620772874');
permittedChannels.set('296690626244902913', '589233677066698763');

function containsRequest(msg: string): boolean {
    if (msg == '<@618408394247634946> Спойте, Михаил!') {
        return true;
    }

    if (msg == '<@618408394247634946> Маэстро, будьте добры!') {
        return true;
    }

    if (msg == '<@618408394247634946> Михаил, давайте нашу любимую!') {
        return true;
    }

    return false;
}

let discordClient = new Client();
discordClient.on("message", async msg => {
    if (msg.channel.type != 'text') {
        return;
    }

    let channel: TextChannel;
    // @ts-ignore
    channel = msg.channel;

    if (permittedChannels.has(msg.guild.id)) {
        if (permittedChannels.get(msg.guild.id) !== msg.channel.id) {
            return;
        }
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
discordClient.login(process.env.DISCORD_BOT_TOKEN);