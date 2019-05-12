<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Add Expense
                </h2>
                <section>
                    <form @submit.prevent="add_expense">
                        <b-field  label="Name">
                            <b-input required v-model="expenses.name"></b-input>
                        </b-field>
                        <b-field label="amount">
                            <b-input required v-model="expenses.total"></b-input>
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
        name: "new_expense",
        components:{BButton},
        data(){
            return{
                edit:false,
                expense_id:null,
                expenses:{
                    name:"",
                    date_time:new Date()
        }
            }
        },
        created(){
            if(this.$route.params.id!==undefined){
                this.expense_id=this.$route.params.id;
                this.$db('expenses')
                    .where({id:this.expense_id})
                    .then(rows=>{
                        this.expenses=rows[0];
                    });
                this.edit=true;
            }
        },
        methods:{
            add_expense(){
                if(this.edit){
                    this.$db('expenses')
                        .where({id:this.expense_id})
                        .update(this.expenses)
                        .then(res=>{
                            this.$router.push({name:"all_expense"});
                            this.$toast.open({
                                message: 'Successfully updated!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            this.$MyLogger.write_log(error)
                        })
                }else{
                    this.$db('expenses')
                        .insert(this.expenses)
                        .then(res=>{
                            this.$toast.open({
                                message: 'Successfully Add expenses!',
                                type: 'is-success'
                            });
                            this.expenses.expenses_name="";
                            this.$router.push({name:'all_expense'})
                        })
                        .catch(err=>{
                            this.$toast.open({
                                duration: 5000,
                                message: `Something's not good, Error to Add expenses`,
                                type: 'is-danger'
                            });
                            this.$MyLogger.write_log(err)
                        })
                }

            }
        }
    }
</script>

<style scoped>

</style>
