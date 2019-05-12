<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Setup Restaurant Information
                </h2>
                <section>
                    <form @submit.prevent="add_restaurent_info()">
                        <b-field label="Restaurant Name">
                            <b-input required v-model="restaurant.restaurant_name"></b-input>
                        </b-field>
                        <b-field label="Mobile">
                            <b-input required v-model="restaurant.mobile"></b-input>
                        </b-field>
                        <b-field label="Telephone">
                            <b-input v-model="restaurant.phone"></b-input>
                        </b-field>
                        <b-field label="Restaurant Address">
                            <b-input v-model="restaurant.address" maxlength="200" type="textarea"></b-input>
                        </b-field>
                        <input class="button is-link" type="submit" value="Next">
                    </form>

                </section>


            </div>
        </div>
    </section>

</template>

<script>
    export default {
        name: "restaurant_info",
        data(){
            return{

                restaurant:{
                    restaurant_name:"",
                    mobile:"",
                    phone:"",
                    address:""
                }
            }
        },
        created(){
            this.$db('info').then(rows=>{
                this.$router.push({path:'/'});
            }).catch(err=>{
                this.$db.schema.createTable('info', (table) => {
                    table.increments('id');
                    table.string('restaurant_name');
                    table.string('address');
                    table.string('mobile');
                    table.string('phone');
                    table.string('logo');
                })
                    .then((res) => {
                        console.log(res)
                    });

                this.$parent.first_run=true;
            })

        },
        methods:{
            add_restaurent_info(){
                this.$db('info').insert(this.restaurant)
                    .then((res) => {
                        this.$parent.progress+=10;
                        this.$parent.restaurant_info=true;
                    })
                    .catch(err=>{
                        console.log(err)
                    });
                //console.log(this.restaurant)
            }
        }
    }
</script>

<style scoped>

</style>
