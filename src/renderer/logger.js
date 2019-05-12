import { remote } from 'electron';
var fs = require('fs');
import path from 'path';
var os = require("os");

export default class MyLogger {
    constructor(){
        this.filepath=path.join(remote.app.getPath('userData'), '/app_log.log');
    }
    write_log(text){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;


        fs.appendFile(this.filepath, dateTime+" "+text+text + os.EOL, function (err) {
            if (err) {
                // append failed
            } else {
                // done
            }
        })
    }
}
