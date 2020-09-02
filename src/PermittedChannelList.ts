import {SqliteDbAdapter} from "./SqliteDbAdapter";

export default class PermittedChannelList {
    private db: SqliteDbAdapter;

    private permittedChannels = new Map<string, void>();

    constructor(db: SqliteDbAdapter) {
        this.db = db;
    }


    isPermitted(channel_id: string): boolean
    {
        return this.permittedChannels.has(channel_id);
    }

    addPermission(channel_id: string, author_id: string, author_name: string)
    {
        this.permittedChannels.set(channel_id);
        this.db.run("INSERT INTO permitted_channels(channel_id, author_id, author_name) VALUES (?1, ?2, ?3)", {
            1: channel_id,
            2:author_id,
            3:author_name,
        })
    }

    async loadPermissions()
    {
        let data = await this.db.all("SELECT * FROM permitted_channels");
        data.forEach((row) => {
            this.permittedChannels.set(row.channel_id);
            console.log(row.channel_id);
        })
    }
}