export default{
    path:'/home',
    component:() => import('@/components/Home'),
    redirect:'/welcome',
    children:[
        {
            path:'/welcome',
            component:() => import('@/components/welcome') 
        },
        {
            path:'/users',
            component:() => import('@/components/User') 
        },
        {
            path:'/rights',
            component:() => import('@/components/Power/rights.vue')
        },
        {
            path:'/roles',
            component:()=>import('@/components/Power/roles.vue')
        },
        {
            path :'/categories',
            component :()=>import('@/components/Goods/classification.vue')
        },
        {
            path :'/params',
            component :()=>import('@/components/Goods/params.vue')
        },
        {
            path :'/goods',
            component :()=>import('@/components/Goods/goods.vue')
        },
        {
            path :'/goods/add',
            component :()=>import('@/components/Goods/Add.vue')
        },
        {
            path :'/orders',
            component :()=>import('@/components/Orders')
        },
        {
            path :'/reports',
            component :()=>import('@/components/Reports')
        }
        
    ]
}