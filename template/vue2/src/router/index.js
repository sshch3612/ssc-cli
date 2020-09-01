import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    routes: [
        {
            path: "/",
            component: () => import("@/views/index"),
            children: [
                {
                    path: "",
                    name: "安全管控",
                    component: () => import("@/views/overview/index.vue"),
                },
            ],
        },
    ],
});
router.beforeEach((to, from, next) => {
    next();
});

export default router;
