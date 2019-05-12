<template>
    <section  class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Add Food Category
                </h2>
                <section>
                    <form @submit.prevent="add_food_cat">
                        <b-field label="Name">
                            <b-input required v-model="category.category_name"></b-input>
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
        name: "food_category",
        components:{BButton},
        data(){
            return{
                edit:false,
                cat_id:null,
                category:{
                    category_name:""
                }
            }
        },
        created(){
            if(this.$route.params.id!==undefined){
                this.cat_id=this.$route.params.id;
                this.$db('food_category')
                    .where({id:this.cat_id})
                    .then(rows=>{
                        this.category=rows[0];
                    });
                this.edit=true;
            }
        },
        methods:{
            add_food_cat(){
                if(this.edit){
                    this.$db('food_category')
                        .where({id:this.cat_id})
                        .update(this.category)
                        .then(res=>{
                            this.$router.push({name:"food_category"})
                            this.$toast.open({
                                message: 'Successfully updated!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            this.$MyLogger.write_log(error)
                        })
                }else{
                    this.$db('food_category')
                        .insert(this.category)
                        .then(res=>{
                            this.$toast.open({
                                message: 'Successfully Add Category!',
                                type: 'is-success'
                            });
                            this.category.category_name="";
                            this.$router.push({name:'food_category'})
                        })
                        .catch(err=>{
                            this.$toast.open({
                                duration: 5000,
                                message: `Something's not good, Error to Add Category`,
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
