<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Setup User Information
                </h2>
                <section>
                    <form @submit.prevent="add_user_info">
                        <b-field label="Name">
                            <b-input required v-model="user.name"></b-input>
                        </b-field>
                        <b-field label="Username">
                            <b-input required v-model="user.username"></b-input>
                        </b-field>
                        <b-field label="Password">
                            <b-input required type="password"
                                     v-model="user.password"
                                     password-reveal>
                            </b-input>
                        </b-field>
                        <b-field label="Mobile">
                            <b-input v-model="user.mobile"></b-input>
                        </b-field>
                        <b-field label="Address">
                            <b-input v-model="user.address" maxlength="200" type="textarea"></b-input>
                        </b-field>
                        <input class="button is-link" type="submit" value="Finish">
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
                    address:"",
                    password:""
                }
            }
        },
        created(){
            this.$db('users').then(rows=>{
                this.$router.push({path:'/'});
                console.log(rows)
            }).catch(err=>{
                //this.$MyLogger.write_log(err)

                this.$db.schema.createTable('users', (table) => {
                    table.increments('id');
                    table.string('username');
                    table.string('password');
                    table.string('name');
                    table.string('mobile');
                    table.string('address');
                })
                    .then((res) => {
                        console.log(res)
                    })
            })

        },
        methods:{
            add_user_info(){
                this.$db('users').insert(this.user)
                    .then((res) => {

                        var filepath = path.join(remote.app.getPath('userData'), '/install.mk')
                        var content = "Installation complete";

                        fs.writeFile(filepath, content, (err) => {
                            if (err) {
                                this.$MyLogger.write_log(err);
                                this.$dialog.alert({
                                    title: 'Error',
                                    message: 'Something\'s not good but I have a custom <b>icon</b> and <b>type</b>',
                                    type: 'is-danger',
                                    hasIcon: true,
                                    icon: 'times-circle',
                                    iconPack: 'fa'
                                });

                                console.log(err);
                                return;
                            }

                            this.$dialog.alert({
                                title: 'Success',
                                message: 'Successfully installed, Please Re-Open App',
                                type: 'is-success',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa'
                            })
                        });

                        this.$parent.progress+=10;
                        this.$parent.user_info=true;
                        this.$router.push({path:'/'})
                        this.$electron.app.quit();
                    })
                    .catch(err=>{
                        console.log(err)
                    });
                //console.log(this.user)
            }
        }
    }
</script>

<style scoped>

</style>
