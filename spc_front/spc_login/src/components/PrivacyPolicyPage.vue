<!-- src/views/PrivacyPolicyPage.vue -->
<template>
    <v-container class="fill-height background-image" fluid>
      <v-row class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <span class="headline">Política de Privacidade</span>
            </v-card-title>
            <v-card-text>
              <p>
                Esta política de privacidade descreve como coletamos, usamos e protegemos seus dados pessoais...
                <!-- Coloque o texto da sua política de privacidade aqui -->
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "PrivacyPolicyPage",
  };
  </script>
  
  <style scoped>
  .v-container.background-image {
    background-image: url('@/assets/abstract.jpg');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
  }
  </style>
  