<template>
    <section>
        <b-field label="Search">
            <b-input v-model="search_text" v-on:input="search_data"></b-input>
        </b-field>
        <div class="parent">
            <div class="food" v-for="(food) in data" :key="food.id">
                <a @click="add_cart(food)">
                    <div >
                        <span><b>{{food.name}}</b></span>
                    </div>
                    <img v-if="!('name' in food.pic)" style="height: 64px;width: 64px" :src="food.pic.path" alt="">
                    <img v-else style="height: 64px;width: 64px" :src="'file://'+food.pic.path" alt="">
                    <div>
                        <span>{{food.price}} <b>৳</b></span>
                    </div>
                </a>

            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "set_menu",
        props: {
            category_id:{
                //required: true
            }
        },
        data() {
            return {
                g_cat_id: this.category_id,
                search_text:"",
                data:null,
            };
        },
        methods: {
            loadAsyncData() {
                this.$db
                    .from('set_menu')
                    .orWhere('name', 'like', '%'+this.search_text+'%')
                    .where('sts',1)
                    .orderBy('id', 'desc')
                    .limit(500)
                    .then(data => {
                        this.data = []
                        data.forEach((item) => {
                            var pic=item.pic;
                            if(pic!==undefined && pic!==null){
                                item.pic=this.$MyImage.read_img(pic)
                            }else if(pic==null){
                                item.pic={
                                    path:"data:image/webp;base64,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"
                                };
                            }else{
                                item.pic={
                                    path:"data:image/webp;base64,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"
                                };
                            }
                            this.data.push(item)
                        });
                    })
                    .catch((error) => {
                        this.data = []
                        this.$MyLogger.write_log(error)
                        throw error
                    })
            },
            search_data(){
                this.loadAsyncData();
            },
            add_cart(food){
                var get_food=food;
                get_food.qty=1;
                get_food.type='set_menu';
                get_food.menu_id=food.id;
                this.$emit('update_cart_set_menu',get_food);
                this.search_text="";
                this.search_data();
                //console.log(food)
            }
        },
        created() {
            this.loadAsyncData();
        }
    }
</script>

<style scoped>
    .parent {
        display: flex;
        flex-wrap: wrap;
        height: 200px;
        overflow-y: auto;
    }
    .parent>img{
        padding: 10px;
    }
    .food {
        flex: 1 0 21%; /* explanation below */
        margin: 5px;
        height: 100px;
        text-align: center;
    }
</style>
