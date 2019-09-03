import {TextChannel} from "discord.js";

export class Singer {
    public async sing(text: Array<string>, channel: TextChannel) {
        await this.inhale(3000);
        for (let line of text) {
            channel.send(line);
            await this.inhale(3500);
        }
    }

    public inhale(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}