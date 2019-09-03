import {config as dotenvInit} from 'dotenv';
import {Client, TextChannel, VoiceChannel} from "discord.js";
import {Blocker} from "./src/Blocker";
import {Singer} from "./src/Singer";
import {ThirdSeptember} from "./src/ThirdSeptember";

dotenvInit();

const blocker = new Blocker();
const singer = new Singer();
const thirdSeptemberText = ThirdSeptember.getText();
const permittedChannels = new Map<string, string>();
permittedChannels.set('207912188407578624', '211650891336515585');
permittedChannels.set('203632333620772874', '203632333620772874');
permittedChannels.set('296690626244902913', '589233677066698763');

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

    if (msg.content != '<@618408394247634946> Спойте, Михаил!') {
        console.log(msg.content);
        return;
    }

    blocker.block(msg.guild.id);
    if (msg.guild.id == '207912188407578624') {
        let voiceChannel: VoiceChannel;
        // @ts-ignore
        voiceChannel = msg.guild.channels.find(c => c.id == '477156726257483786');
        singer.singInVoiceChannel('third-sept', voiceChannel);
    }
    await singer.singInTextChannel(thirdSeptemberText, channel);
    blocker.unblock(msg.guild.id);
});
discordClient.login(process.env.DISCORD_BOT_TOKEN);