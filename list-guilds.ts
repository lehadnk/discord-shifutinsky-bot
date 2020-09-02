import {config as dotenvInit} from 'dotenv';
import {Client, TextChannel, VoiceChannel} from "discord.js";
let discordClient = new Client();

dotenvInit();

discordClient.on('ready', async () => {
    await discordClient.guilds.forEach(guild => console.log(guild.name));
    process.exit(0);
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);