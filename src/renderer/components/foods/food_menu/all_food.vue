<template>
    <div class="hero-body">
        <div class="container">
            <h2 class="subtitle">
                All Food Item
            </h2>
            <section>
                <div class="columns">
                    <div class="column">
                        <router-link class="button is-primary" :to="{name:'food_add'}">Add New</router-link>
                    </div>
                    <div class="column">

                    </div>
                    <div class="column">

                    </div>
                    <div class="column">
                        <b-field label="Search">
                            <b-input required v-model="search_text" v-on:input="search_data"></b-input>
                        </b-field>
                    </div>
                </div>

                <b-table
                        :data="data"
                        :loading="loading"

                        paginated
                        backend-pagination
                        :total="total"
                        :per-page="perPage"
                        @page-change="onPageChange"
                        aria-next-label="Next page"
                        aria-previous-label="Previous page"
                        aria-page-label="Page"
                        aria-current-label="Current page"

                        backend-sorting
                        :default-sort-direction="defaultSortOrder"
                        :default-sort="[sortField, sortOrder]"
                        @sort="onSort"
                        bordered

                >

                    <template slot-scope="props">
                        <b-table-column field="id" label="id" numeric sortable>
                            {{ props.row.id }}
                        </b-table-column>

                        <b-table-column field="name" label="name"  sortable>
                            {{ props.row.name }}
                        </b-table-column>
                        <b-table-column field="pic" label="pic"  >
                            <img v-if="!('name' in props.row.pic)" style="height: 64px;width: 128px" :src="props.row.pic.path" alt="">
                            <img v-else style="height: 64px;width: 128px" :src="'file://'+props.row.pic.path" alt="">
                        </b-table-column>
                        <b-table-column field="category_name" label="category"  sortable>
                            {{ props.row.category_name }}
                        </b-table-column>
                        <b-table-column field="unit" label="unit"  sortable>
                            {{ props.row.unit }}
                        </b-table-column>
                        <b-table-column field="price" label="price"  sortable>
                            {{ props.row.price }}
                        </b-table-column>

                        <b-table-column field="id" label="Status" >

                            <b-button  type="is-success">Active</b-button>

                        </b-table-column>
                        <b-table-column field="id" label="Update" >

                            <router-link :to="{name:'edit_food',params:{id:props.row.id}}" class="button is-warning">Update</router-link>

                        </b-table-column>
                        <b-table-column field="id" label="Delete" >

                            <b-button v-on:click="s_delete(props.row.id)" type="is-danger">Delete</b-button>

                        </b-table-column>
                    </template>
                </b-table>
            </section>
        </div>
    </div>

</template>

<script>

    import BButton from "buefy/src/components/button/Button";
    export default {
        name:"all_food",
        components: {BButton},
        data() {
            return {
                search_text:"",
                data: [],
                total: 0,
                loading: false,
                sortField: 'id',
                sortOrder: 'desc',
                defaultSortOrder: 'desc',
                page: 1,
                perPage: 10
            }
        },
        methods: {
            search_data(){
                this.loadAsyncData();
            },
            /*
             * Load async data
             */
            loadAsyncData() {
                this.loading = true;
                this.$db
                    .select(['foods.id','foods.name','foods.sts','foods.unit','foods.price','foods.pic','food_category.category_name'])
                    .from('foods')
                    .orWhere('name', 'like', '%'+this.search_text+'%')
                    .join('food_category', 'foods.cat_id', '=', 'food_category.id')
                    .where('foods.sts',1)
                    .orderBy('foods.id', 'desc')

                    .limit(500)
                    .then(data => {
                        //console.log(data)
                        this.data = []
                        let currentTotal = data.length
                        if (data.length / this.perPage > 1000) {
                            currentTotal = this.perPage * 1000
                        }
                        this.total = currentTotal;
                        data.forEach((item) => {
                            var pic=item.pic;
                            //console.log(pic)
                            if(pic!==undefined && pic!==null){
                                item.pic=this.$MyImage.read_img(pic)
                            }else{
                                item.pic={
                                    path:"data:image/webp;base64,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"
                                };
                            }
                            this.data.push(item)
                        })
                        this.loading = false
                    })
                    .catch((error) => {
                        this.data = []
                        this.total = 0
                        this.loading = false
                        throw error
                    })
            },
            /*
             * Handle page-change event
             */
            onPageChange(page) {
                this.page = page
                this.loadAsyncData()
            },
            /*
             * Handle sort event
             */
            onSort(field, order) {
                this.sortField = field
                this.sortOrder = order
                this.loadAsyncData()
            },
            /*
             * Type style in relation to the value
             */
            type(value) {
                const number = parseFloat(value)
                if (number < 6) {
                    return 'is-danger'
                } else if (number >= 6 && number < 8) {
                    return 'is-warning'
                } else if (number >= 8) {
                    return 'is-success'
                }
            },

            s_delete(id){
                console.log(id)
                this.$dialog.confirm({
                    title: 'Deleting Item',
                    message: 'Are you sure you want to <b>delete</b> this Item? This action cannot be undone.',
                    confirmText: 'Delete',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$db('foods')
                            .where({ id: id })
                            .update({sts:0})
                            .then(res=>{
                                this.$toast.open('Item deleted!');
                                this.loadAsyncData();
                            })
                            .catch(err=>{
                                this.$toast.open('Can\'t delete!');
                                this.$MyLogger.write_log(err)
                            })

                    }
                });
            },
        },
        filters: {
            /**
             * Filter to truncate string, accepts a length parameter
             */
            truncate(value, length) {
                return value.length > length
                    ? value.substr(0, length) + '...'
                    : value
            }
        },
        mounted() {
            this.loadAsyncData()
        }
    }
</script>
