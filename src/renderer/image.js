var remote = require('electron').remote;
var fs = remote.require('fs');
import path from 'path';

export default class MyImage {

    constructor(){

        var pth=path.join(remote.app.getPath('userData'), '/imgs')
        if (!fs.existsSync(pth)) fs.mkdir(pth);
    }

    save_image(Image,Name,format){
        var _img = fs.readFileSync(Image).toString('base64');
        const imageBuffer = new Buffer(_img, "base64");

        var sp_format=format.split("/");
        var img_name = Name+"."+sp_format[sp_format.length-1];
        fs.writeFileSync(path.join(remote.app.getPath('userData'), '/imgs/'+img_name), imageBuffer);

        return img_name;
    }

    read_img(file){
        let image = {};
        image.name = file;
        image.path = path.join(remote.app.getPath('userData'),'/imgs/'+ file);
        image.base64 = new Buffer(fs.readFileSync(image.path)).toString('base64');

        return image;
    }
}
