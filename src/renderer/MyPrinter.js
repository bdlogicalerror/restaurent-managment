var remote = require('electron').remote;
import path from 'path';
var fs = remote.require('fs');
const os = require("os");
export default class MyPrinter {
    constructor(){
        this.temp_path=os.tmpdir();
        this.PrintOptions={
            pageSize:"A4",
            marginsType: 1,
            printBackground: true,
            printSelectionOnly: false,
            landscape: false
        }
        this.imgsPath=path.join(remote.app.getPath('userData'), '/imgs')
        const winURL = process.env.NODE_ENV === 'development'
            ? `http://localhost:9080`
            : `file://${__dirname}/index.html`
        this.home_url=winURL;
    }

    SendPrint(url){
        let win = new remote.BrowserWindow({show: false })
        win.loadURL(this.home_url+'#'+url);
    }

    PrintMePDF(){
        let win = remote.getCurrentWebContents();
        let win1 = remote.getCurrentWindow();

        win.webContents.on('did-finish-load', () => {
            //win.show();
            // Use default printing options

            win.printToPDF({}, (error, data) => {
                if (error) throw error
                fs.writeFile(this.imgsPath+'/print.pdf', data, (error) => {
                    if (error) throw error
                    console.log('Write PDF successfully.')
                    win1.close();
                    remote.shell.beep();
                })

            })
        })
    }
    PrintToPrinter(){
        let win = remote.getCurrentWebContents();
        let win1 = remote.getCurrentWindow();
        win.webContents.on('did-finish-load', () => {
            win.webContents.print(this.PrintOptions,function (success) {
                if(success){
                    win1.close();
                }

            });
        });



    }
}
