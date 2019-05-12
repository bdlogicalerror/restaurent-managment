import Datastore from 'knex';
import path from 'path';
import { remote } from 'electron'

export default new Datastore({
    client:'sqlite3',
    connection:{
        filename: path.join(remote.app.getPath('userData'), '/data.db'),
        useNullAsDefault: true
    }
});
