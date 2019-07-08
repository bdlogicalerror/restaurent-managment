<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Add Customer
                </h2>
                <section>
                    <form @submit.prevent="add_customer">
                        <b-field label="Name">
                            <b-input required v-model="customer.name"></b-input>
                        </b-field>
                        <b-field label="mobile">
                            <b-input  v-model="customer.mobile"></b-input>
                        </b-field>
                        <!--<b-field label="Birth Date">
                            <b-datepicker v-model="customer.birth_date"
                                    placeholder="Click to select..."
                                    icon="calendar-today">
                            </b-datepicker>
                        </b-field>-->
                        <b-field label="Address">
                            <b-input v-model="customer.address" maxlength="200" type="textarea"></b-input>
                        </b-field>
                        <input class="button is-link" type="submit" value="Save">
                    </form>
                </section>

            </div>
        </div>
    </section>
</template>

<script>
    import BButton from "buefy/src/components/button/Button";
    export default {
        name: "new_customer",
        components:{BButton},
        props: {
            me_as_child:{

            }
        },
        data(){
            return{
                child:this.me_as_child,
                edit:false,
                cus_id:null,
                customer:{

                }
            }
        },
        created(){
            if(this.$route.params.id!==undefined){
                this.cus_id=this.$route.params.id;
                this.$db('customers')
                    .where({id:this.cus_id})
                    .then(rows=>{
                        this.customer=rows[0];
                    });
                this.edit=true;
            }
        },
        methods:{
            add_customer(){

                this.$loading.open();

                if(this.edit){
                    this.$db('customers')
                        .where({id:this.cus_id})
                        .update(this.customer)
                        .then(res=>{
                            this.$loading.close();
                            this.$router.push({name:"all_customer"})
                            this.$toast.open({
                                message: 'Successfully updated!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            this.$loading.close();
                            this.$MyLogger.write_log(error)
                        })
                }else{
                    this.$db('customers')
                        .insert(this.customer)
                        .then(res=>{
                            //console.log(res[0])
                            this.$loading.close();
                            this.$toast.open({
                                message: 'Successfully Add customer!',
                                type: 'is-success'
                            });
                            this.customer.customer_name="";
                            if(this.child){
                                this.$emit('customer_added');
                            }
                            //this.$router.push({name:'all_customer'})
                        })
                        .catch(err=>{
                            this.$loading.close();
                            this.$toast.open({
                                duration: 5000,
                                message: `Something's not good, Error to Add customer`,
                                type: 'is-danger'
                            });
                            this.$MyLogger.write_log(err)
                        })
                }

            },
        }
    }
</script>

<style scoped>

</style>
