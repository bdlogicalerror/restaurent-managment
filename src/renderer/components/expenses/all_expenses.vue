<template>
    <div class="hero-body">
        <div class="container">
            <h2 class="subtitle">
                All Expenses
            </h2>
            <section>
                <div class="columns">
                    <div class="column">
                        <b-field label="from date">
                            <b-datepicker
                                    v-model="from_date"
                                    placeholder="Type or select a date..."
                                    icon="calendar-today"
                                    editable>
                            </b-datepicker>
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="to date">
                            <b-datepicker
                                    v-model="to_date"
                                    placeholder="Type or select a date..."
                                    icon="calendar-today"
                                    editable>
                            </b-datepicker>
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="Search">
                            <b-button @click="search_data" type="is-primary">Search</b-button>
                        </b-field>
                    </div>
                    <div class="column">
                        <b-field label="Search">
                            <b-input  v-model="search_text" v-on:input="search_data"></b-input>
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
                        <b-table-column field="date_time" label="date-time"  sortable>
                            {{ props.row.date_time }}
                        </b-table-column>
                        <b-table-column field="total" label="amount"  sortable>
                            {{ props.row.total }}
                        </b-table-column>

                        <b-table-column field="id" label="Status" >

                            <b-button  type="is-success">Active</b-button>

                        </b-table-column>
                        <b-table-column field="id" label="Update" >

                            <router-link :to="{name:'edit_expense',params:{id:props.row.id}}" class="button is-warning">Update</router-link>

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
        name:"all_expenses",
        components: {BButton},
        data() {
            const today=new Date();
            return {
                from_date:new Date(today.getTime() - (24*60*60*1000)*7),
                to_date:today,
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
                this.$db('expenses')
                    .orWhere('name', 'like', '%'+this.search_text+'%')
                    .where('sts', 1)
                    .orderBy('id', 'desc')
                    .limit(500)
                    .then(data => {
                        this.data = []
                        let currentTotal = data.length
                        if (data.length / this.perPage > 1000) {
                            currentTotal = this.perPage * 1000
                        }
                        this.total = currentTotal;
                        data.forEach((item) => {
                            var date=new Date(item.date_time).toLocaleDateString();
                            item.date_time=date;
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
                this.$dialog.confirm({
                    title: 'Deleting Item',
                    message: 'Are you sure you want to <b>delete</b> this Item? This action cannot be undone.',
                    confirmText: 'Delete',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$db('expenses')
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
                console.log(id)
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
