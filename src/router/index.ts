import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

import HomeView from '../views/HomeView.vue';
import AuthView from '../views/AuthView.vue';
import StopView from '../views/StopView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/stop/:id',
      name: 'stop',
      component: StopView,
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: HomeView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'auth' });
  } else if (to.name === 'auth' && userStore.isAuthenticated) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
