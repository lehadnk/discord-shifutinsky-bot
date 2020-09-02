import {SqliteDbAdapter} from "./src/SqliteDbAdapter";
import {Database} from 'sqlite3';

let databaseFile = './db.db3';
let db = new Database(databaseFile);
this.db = new SqliteDbAdapter(db);

this.db.run("CREATE TABLE IF NOT EXISTS permitted_channels (id INTEGER PRIMARY KEY AUTOINCREMENT, channel_id string NOT NULL, author_id string NOT NULL, author_name string NOT NULL);").catch(e => console.error(e));