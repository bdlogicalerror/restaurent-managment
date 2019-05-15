<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Need Any Help?
                        </p>

                    </header>
                    <div class="card-content">
                        <p>Contact <b>license@gotisoft.com</b> Or <b>+8801717067913</b> for get your license key</p>
                        <br>
                        <p>Get <b>7 </b>Days trial *(<b style="color: red">internet required</b>) </p><b-button @click="check_via_net" type="is-success">Get Trial</b-button>
                    </div>
                </div>
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Enter your License Key
                        </p>

                    </header>
                    <div class="card-content">
                        <section>
                            <form @submit.prevent="make_login">
                                <b-field label="Machine ID: ">
                                    <b>{{machine_id}}</b>
                                </b-field>
                                <b-field label="License Key">
                                    <b-input v-model="license" required></b-input>
                                </b-field>
                                <input class="button is-link" type="submit" value="Validate">
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>

        <!--Register modal-->
        <b-modal width="40" has-modal-card :active.sync="register_sts">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Register</p>
                </header>
                <section class="modal-card-body">
                    <register @hide_register="register_complete"></register>
                </section>
            </div>
        </b-modal>
    </section>
</template>

<script>
    import {machineId, machineIdSync} from 'node-machine-id';
    import register from './install/user_info'
    var dns = require("dns");
    export default {
        name: "login",
        components:{
          register
        },
        data() {
            return {
                register_sts:false,
                machine_id:this.$SystemControl.machine_id,
                isConnected:false,
                license: null
            }
        },
        created() {
            this.$parent.showNav = false;
        },
        methods: {
            register_complete(){
                this.register_sts=false
                this.check_via_net();
                this.make_login();
            },
            check_via_net(){
                var logindata={
                    machine_id: this.machine_id,
                };

                this.$http.post(this.$RemoteServer+'login',logindata,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((result) => {
                        if(result.data.sts){
                            //console.log(result.data.license_key)
                            this.license=result.data.license_key
                        }else{
                            this.register_sts=true;
                            console.log(result.data)
                        }
                        //console.log(result)
                    })
                    .catch((err) => {
                        console.log(err)
                        this.$MyLogger.write_log(err)
                    });
            },
            make_login() {
                var decrypt=this.$SystemControl.decrypt_data(this.license);
                if(decrypt){
                    var install=this.$SystemControl.make_install_file(this.license)
                    console.log(install)
                    this.$SystemControl.check_expiry()
                }else{

                }
            }

        }
    }
</script>

<style scoped>

</style>
