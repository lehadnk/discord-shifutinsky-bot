import {TextChannel, VoiceChannel} from "discord.js";

export class Singer {
    public async singInTextChannel(text: Array<[string, number]>, channel: TextChannel) {
        await this.inhale(3500);
        channel.send('Ладно-ладно, мои дорогие, только для вас, еще раз. Пойте вместо со мной.');
        await this.inhale(3000);
        for (let line of text) {
            channel.send(line[0]);
            await this.inhale(line[1]);
        }
    }

    public async sayNo(channel: TextChannel)
    {
        await this.inhale(1500);
        channel.send('Третьего сентября все будет, мои дорогие.');
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