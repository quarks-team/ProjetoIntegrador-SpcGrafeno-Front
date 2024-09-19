<!-- src/views/TermsPage.vue -->
<template>
    <v-container class="fill-height background-image" fluid>
      <v-row class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <span class="headline">Termos e Condições</span>
            </v-card-title>
            <v-card-text>
              <!-- Coloque aqui o conteúdo dos termos e condições -->
              <p>
                Bem-vindo aos nossos Termos e Condições. Ao usar este site, você concorda com os seguintes termos...
                <!-- Adicione mais texto ou detalhes sobre os termos -->
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "TermsPage",
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
  