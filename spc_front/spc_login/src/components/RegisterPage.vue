import Vue from 'vue';
import Router from 'vue-router';
import LoginPage from '/components/LoginPage.vue';
import RegisterPage from '/components/RegisterPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
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
  ],
});
