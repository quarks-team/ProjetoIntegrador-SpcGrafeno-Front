import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import TermsPage from '@/components/TermsPage.vue';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage.vue';
import HomePage from '@/components/HomePage.vue';
import path from 'path';
import FormDuplicatePage from '@/components/FormDuplicatePage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
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
    /*meta: { requiresAuth: true },*/
  },
  {
    path: '/form-duplicates',
    name: 'FormDuplicate',
    component: FormDuplicatePage
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
