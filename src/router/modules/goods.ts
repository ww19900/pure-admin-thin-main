export default {
  path: "/goods",
  redirect: "/views/goods",
  meta: {
    icon: "informationLine",
    title: "商品管理",
    // showLink: false,
    rank: 9
  },
  children: [
    {
      path: "/goods/one",
      name: "one",
      component: () => import("@/views/goods/one.vue"),
      meta: {
        title: "商品类型"
      }
    },
    {
      path: "/goods/there",
      name: "there",
      component: () => import("@/views/goods/there.vue"),
      meta: {
        title: "商品轮播"
      }
    }
  ]
} as RouteConfigsTable;
