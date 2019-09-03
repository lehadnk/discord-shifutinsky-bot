import {TextChannel, VoiceChannel} from "discord.js";

export class Singer {
    public async singInTextChannel(text: Array<string>, channel: TextChannel) {
        await this.inhale(3000);
        for (let line of text) {
            channel.send(line);
            await this.inhale(3500);
        }
    }

    public async singInVoiceChannel(trackName: string, channel: VoiceChannel) {
        channel.join().then(connection => {
            const dispatcher = connection.playFile('./../resources/'+trackName+'.mp3');
            dispatcher.on('end', () => channel.leave());
        });
    }

    public inhale(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}