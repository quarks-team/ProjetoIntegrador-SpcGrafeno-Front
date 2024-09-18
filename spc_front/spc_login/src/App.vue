<template>
  <v-app>
    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue';

export default {
  name: 'App',

  components: {
    LoginPage,
    RegisterPage
  },

  data: () => ({
    //
  }),
}
</script>