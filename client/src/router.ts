import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

export function createRouterApp(){
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  return router;
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./components/Page.vue')
  }
]