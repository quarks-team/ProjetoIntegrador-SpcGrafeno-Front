<template>
    <v-container class="fill-height" fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <span class="headline">Cadastro</span>
            </v-card-title>
            <v-card-text>
              <v-form>
                <!-- Campos de cadastro aqui -->
              </v-form>
              <router-link to="/login">Já tem uma conta? Faça login</router-link>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'RegisterPage',
  };
  </script>
  