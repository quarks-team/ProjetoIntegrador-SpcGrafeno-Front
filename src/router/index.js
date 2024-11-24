import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import TermsPage from '@/components/TermsPage.vue';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage.vue';
import HomePage from '@/components/HomePage.vue';
import ConsentSettings from '@/components/ConsentSettings.vue';
import FormDuplicatePage from '@/components/FormDuplicatePage.vue';
import UploadCsvPage from '@/components/UploadCsvPage.vue';
import DashDataPreviewPage from '@/components/DashDataPreviewPage.vue';

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
    meta: { requiresAuth: true },
  },
  {
    path: '/config',
    name: 'ConsentSettings',
    component: ConsentSettings,
  },
  {
    path: '/duplicatas',
    name: 'Duplicatas',
    component: FormDuplicatePage,
  },
  {
    path: '/upload',
    name: 'UploadCsv',
    component: UploadCsvPage,
  },
  },
  {
    path: '/data-previsao',
    name: 'DashDataPreview',
    component: DashDataPreviewPage,
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
