<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Setup New User Information Or <button @click="go_login" class="button is-success">Enter Serial</button>
                </h2>

                <section>
                    <form @submit.prevent="add_user_info">
                        <b-field label="Name">
                            <b-input required v-model="user.name"></b-input>
                        </b-field>
                        <b-field label="Mobile">
                            <b-input v-model="user.mobile"></b-input>
                        </b-field>
                        <b-field label="Password">
                            <b-input required type="password"
                                     v-model="user.password"
                                     password-reveal>
                            </b-input>
                        </b-field>

                        <input class="button is-link" type="submit" value="Register">
                    </form>

                </section>

            </div>
        </div>
    </section>
</template>

<script>
    import { remote } from 'electron';
    var fs = require('fs');
    import path from 'path';

    export default {
        name: "user_info",
        data(){
            return{

                user:{
                    username:"",
                    mobile:"",
                    name:"",
                    password:"",
                    machine_id:this.$SystemControl.machine_id
                }
            }
        },
        created(){


        },
        methods:{
            go_login(){
              this.$parent.$data.register_sts=false;
            },
            add_user_info(){


                this.$http.post(this.$RemoteServer+'register',this.user,{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((result) => {

                        if(result.data.sts){
                            this.$emit('hide_register');
                            this.$toast.open({
                                message: 'Successfully Add User!',
                                type: 'is-success'
                            });
                        }else {

                        }

                    })
                    .catch((err) => {
                        console.log(err)
                        this.$MyLogger.write_log(err)
                    });
            }
        }
    }
</script>

<style scoped>

</style>
