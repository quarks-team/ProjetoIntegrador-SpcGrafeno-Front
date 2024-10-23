import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import TermsPage from '@/components/TermsPage.vue';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage.vue';
import HomePage from '@/components/HomePage.vue';
import ConfigConsent from '@/components/ConfigConsent.vue';

const routes = [

  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: (_to, _from, next) => {
      const isAuthenticated = !!localStorage.getItem('cnpj');
      if (isAuthenticated) {
        next({ name: 'Home' });
      } else {
        next();
      }
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/termos',
    name: 'Terms',
    component: TermsPage
  },
  {
    path: '/politica-privacidade',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/config',
    name: 'ConfigConsent',
    component: ConfigConsent,
  },
  {
    path: '/:pathMatch(.*)*',  // Para rotas desconhecidas
    redirect: '/login',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
