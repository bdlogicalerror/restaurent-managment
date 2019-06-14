import { remote } from 'electron';
var fs = require('fs');
import path from 'path';
import axios from 'axios'
import looger from './logger';
const Logger=new looger();
var dns = require("dns");

const crypto=require('crypto')
const assert=require('assert');

import {machineId, machineIdSync} from 'node-machine-id';
import router from './router/index'

import { Toast } from 'buefy/dist/components/toast'
export default class SystemControl{
    constructor(){
        this.filepath = path.join(remote.app.getPath('userData'), '/install.mk');
        this.DBpath = path.join(remote.app.getPath('userData'), '/data.db');

        this.install_sts=false;
        this.expired=false;

        this.algorithm = 'aes256';

        this.expiry_date=null;

        this.machine_id=machineIdSync({original: true});
    }

    check_install(){
        if (fs.existsSync(this.filepath)) {
            this.install_sts=true;
            var data=this.read_install_file()
            if(data.license!==undefined){
                var license=this.decrypt_data(data.license);
                if(license){
                    this.check_expiry();
                }else{
                    router.push({name:'license'})
                }
            }else{
                router.push({name:'license'})
            }
        }else{
            fs.unlink(this.DBpath, (err) => {
                if (err){


                }else{

                }

            });
            router.push({name:'install'})
        }
    }

    read_install_file(){
        let rawdata = fs.readFileSync(this.filepath);
        try{
            let login_data = JSON.parse(rawdata);
            return login_data;
        }catch (e) {
            return false
        }
    }

    make_install_file(license_key){
        var obj={
            license:license_key,
            install_at:new Date(),

        };
        var json = JSON.stringify(obj);
        fs.writeFile(this.filepath, json, 'utf8', function (err,data) {
            if(err){
                return false;

            }
            router.push({path:'/'});
            return data
        });
    }

    decrypt_data(encrypted){
        try{
            var decipher = crypto.createDecipher(this.algorithm, this.machine_id);

            var decrypted = decipher.update(encrypted.toString(), 'hex', 'utf8') + decipher.final('utf8');

            this.expiry_date= decrypted;
            return true;
        }catch (e) {
            Toast.open({
                duration: 5000,
                message: `Invalid License Key Provided`,
                position: 'is-top',
                type: 'is-danger'
            });
            return false;
        }
    }

    check_expiry(){
        fs.access(this.filepath, fs.F_OK, (err) => {
            if (err) {
            }

            var expire_date=new Date(this.expiry_date);
            var today=new Date();
            var diff=expire_date.getTime()-today.getTime();
            var day_diff=(diff/ (24*60*60*1000)).toFixed(0);


            if(day_diff>0){
                return false;
            }else{
                Toast.open({
                    duration: 5000,
                    message: `License Key Expired`,
                    position: 'is-top',
                    type: 'is-danger'
                });
                router.push({name:'login'})

                return true;
            }
        });
    }
}
