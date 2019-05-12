import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/install',
      name: 'install',
      component:require('@/components/install').default
    },
    {
      path: '/about',
      name: 'about',
      component:require('@/components/LandingPage/SystemInformation').default
    },
      /*Food category*/
    {
      name:"food_category_add",
      path:"/add_food_category",
      component:require('@/components/foods/food_category/add_food_category').default
    },
    {
      name:"food_category_edit",
      path:"/edit_food_category/:id",
      component:require('@/components/foods/food_category/add_food_category').default
    },
    {
      name:"food_category",
      path:"/food_category",
      component:require('@/components/foods/food_category/all_category').default
    },
      /*Food route*/
    {
      name:"food_add",
      path:"/add_food",
      component:require('@/components/foods/food_menu/add_food').default
    },
    {
      name:"edit_food",
      path:"/edit_food/:id",
      component:require('@/components/foods/food_menu/add_food').default
    },
    {
      name:"all_foods",
      path:"/food_menu",
      component:require('@/components/foods/food_menu/all_food').default
    },

      /*Expense route*/
    {
      name:"expense_add",
      path:"/expense_add",
      component:require('@/components/expenses/new_expense').default
    },
    {
      name:"edit_expense",
      path:"/edit_expense/:id",
      component:require('@/components/expenses/new_expense').default
    },
    {
      name:"all_expense",
      path:"/all_expense",
      component:require('@/components/expenses/all_expenses').default
    },
      /*Customer route*/
    {
      name:"customer_add",
      path:"/customer_add",
      component:require('@/components/customer/new_customer').default
    },
    {
      name:"edit_customer",
      path:"/edit_customer/:id",
      component:require('@/components/customer/new_customer').default
    },
    {
      name:"all_customer",
      path:"/all_customer",
      component:require('@/components/customer/all_customer').default
    },

    /*POS route*/
    {
      name:"pos",
      path:"/pos",
      component:require('@/components/pos/pos').default
    },
    {
      name:"pos_inv",
      path:"/invoice/:id",
      component:require('@/components/print_file/invoice').default
    },
    {
      name:"pos_inv_view",
      path:"/invoice/:id/:view",
      component:require('@/components/print_file/invoice').default
    },
    {
      name:"sale_report",
      path:"/sale_report",
      component:require('@/components/report/sale_report').default
    },
    {
      name:"purchase_report",
      path:"/purchase_report",
      component:require('@/components/report/purchase_report').default
    },

    /*Purchase router*/
    {
      name:"new_purchase",
      path:"/new_purchase",
      component:require('@/components/purchase/new_purchase').default
    },
  ]
})
