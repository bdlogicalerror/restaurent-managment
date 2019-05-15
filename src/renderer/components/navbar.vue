<template>
    <!--navbar-->
    <nav  class="navbar is-transparent is-fixed-top">
        <div class="navbar-brand">
            <router-link class="navbar-item" :to="{path:'/'}">
                <img src="~@/assets/goti-soft.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
            </router-link>
            <div class="navbar-burger burger" data-target="navbarExampleTransparentExample">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <div id="navbarExampleTransparentExample" class="navbar-menu">
            <div class="navbar-start">
                <router-link class="navbar-item" :to="{path:'/'}">
                    Home
                </router-link>
                <router-link class="navbar-item" :to="{name:'pos'}">
                    POS
                </router-link>


                <!--Customer Menu-->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        Customers
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <router-link class="navbar-item" :to="{name:'customer_add'}">
                            New Customer
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'all_customer'}">
                            All Customer
                        </router-link>

                    </div>
                </div>

                <!--Purchase menu-->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        Purchase
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <router-link class="navbar-item" :to="{name:'new_purchase'}">
                            New Purchase
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'purchase_report'}">
                            Purchase Report
                        </router-link>

                    </div>
                </div>

                <!--Product Menu-->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        Foods
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <router-link class="navbar-item" :to="{name:'all_foods'}">
                            All Food Item
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'food_category'}">
                            Food Category
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'all_set_menu'}">
                            Set Menu
                        </router-link>

                    </div>
                </div>

                <!--Expense Menu-->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        Expenses
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <router-link class="navbar-item" :to="{name:'expense_add'}">
                            Add Expense
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'all_expense'}">
                            Expense Report
                        </router-link>

                    </div>
                </div>

                <!--Report Menu-->
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        Reports
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <router-link class="navbar-item" :to="{name:'sale_report'}">
                            Sale Report
                        </router-link>
                        <router-link class="navbar-item" :to="{name:'purchase_report'}">
                            Purchase Report
                        </router-link>
                        <!--<router-link class="navbar-item" :to="{name:'purchase_report'}">
                            Details Transaction Report
                        </router-link>-->

                    </div>
                </div>

            </div>

            <!--<div class="navbar-end">
                &lt;!&ndash;User Menu&ndash;&gt;
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link" href="#">
                        User
                    </a>
                    <div class="navbar-dropdown is-boxed">
                        <a class="navbar-item" href="#">
                            Edit Info
                        </a>
                        <a class="navbar-item" @click="logout">
                            Logout
                        </a>

                    </div>
                </div>
                &lt;!&ndash;about us&ndash;&gt;-->
                <router-link class="navbar-item" :to="{name:'about'}">
                    About
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "navbar",
        data(){
          return{

          }
        },
        methods:{
            logout(){

                localStorage.removeItem('login');
                window.location.reload();
                console.log('here')

            }
        }
    }
</script>

<style scoped>

</style>
