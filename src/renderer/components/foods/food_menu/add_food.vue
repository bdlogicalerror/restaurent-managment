<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <h2 class="subtitle">
                    Add Food Item
                </h2>
                <section>
                    <form @submit.prevent="add_food">
                        <b-field label="Name">
                            <b-input required v-model="food.name"></b-input>
                        </b-field>
                        <b-field label="Unit">
                            <b-input required v-model="food.unit"></b-input>
                        </b-field>
                        <b-field label="Price">
                            <b-input required v-model="food.price"></b-input>
                        </b-field>
                        <b-field label="Category">
                            <div class="select">
                                <select required v-model="food.cat_id">
                                    <option v-for="(cat,index) in categories" :value="cat.id">{{cat.category_name}}
                                    </option>
                                </select>
                            </div>
                        </b-field>

                        <b-field class="file">
                            <b-upload v-model="file" accept="image/*">
                                <a class="button is-primary">
                                    <b-icon icon="upload"></b-icon>
                                    <span>Click to upload</span>
                                </a>
                            </b-upload>
                            <span class="file-name" v-if="file">
                                {{ file.name }}
                            </span>
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
        name: "add_food",
        components: {BButton},
        data() {
            return {
                file: null,
                categories: null,
                edit: false,
                food_id: null,
                food: {
                    name: "",
                    unit: "",
                    price: 0,

                }
            }
        },
        created() {
            this.$db('food_category')
                .where({sts:1})
                .then(rows => {
                    console.log(rows)
                    this.categories = rows;
                });
            if (this.$route.params.id !== undefined) {
                this.food_id = this.$route.params.id;
                this.$db('foods')
                    .where({id: this.food_id})
                    .then(rows => {
                        this.food = rows[0];
                    });
                this.edit = true;
            }
        },
        methods: {
           add_food() {
                if (this.edit) {
                    if(this.file.path!==undefined){
                        var img=this.$MyImage.save_image(this.file.path,this.food_id,this.file.type);
                        this.food.pic=img;
                    }
                    this.$db('foods')
                        .where({id: this.food_id})
                        .update(this.food)
                        .then(res => {
                            this.$router.push({name: "all_foods"})
                            this.$toast.open({
                                message: 'Successfully updated!',
                                type: 'is-success'
                            })
                        })
                        .catch(error => {
                            this.$MyLogger.write_log(error)
                        })
                } else {
                    var img;
                    this.$db('foods')
                        .where({sts: '1'})
                        .orderBy('id','DESC')
                        .then(rows=>{

                            var sl=rows.length==undefined?1:rows[0]['id']+1;
                            if(this.file.path!==undefined){
                                img=this.$MyImage.save_image(this.file.path,sl,this.file.type);
                                this.food.pic=img;
                            }
                        })


                    //console.log(img)
                    this.$db('foods')
                        .insert(this.food)
                        .then(res => {


                            this.$toast.open({
                                message: 'Successfully Add!',
                                type: 'is-success'
                            });
                            this.$router.push({name: "all_foods"})
                        })
                        .catch(err => {
                            this.$toast.open({
                                duration: 5000,
                                message: `Something's not good, Error to Add`,
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
