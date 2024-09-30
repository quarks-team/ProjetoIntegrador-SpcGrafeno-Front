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
            <p><strong>Versão:</strong> {{ policy.version }}</p>
            <p><strong>Data de criação:</strong> {{ formatDate(policy.createdAt) }}</p>
            <p>{{ policy.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "PrivacyPolicyPage",
  data() {
    return {
      policy: {
        version: null,
        createdAt: null,
        description: '',
      },
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/policy');
      this.policy = response.data[response.data.length - 1];
    } catch (error) {
      console.error('Erro ao buscar a política de privacidade:', error);
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit'
      });
    }
  }
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
