<template>
    <v-row >
      <!-- Card com o Score Estimado e Recomendações -->
      <v-col cols="12" md="6">
        <v-card outlined class="mx-auto" max-width="500">
          <v-card-title class="text-h6">Recomendações de Score</v-card-title>
          <v-card-text class="pa-4">
            <div v-if="endorserScore && endorserScore.recommended_changes && Object.keys(endorserScore.recommended_changes).length > 0">
              <v-list dense>
                <v-list-item-group v-for="(change, key) in endorserScore.recommended_changes" :key="key">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ key }}</v-list-item-title>
                      <v-list-item-subtitle><strong>Direção:</strong>({{ change.impact_direction }})</v-list-item-subtitle>
                      <v-list-item-subtitle><strong>Impacto:</strong> {{ change.impact }} pontos</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  </v-list-item-group>
                </v-list>
            </div>
            <div v-else>
              <p>{{ endorserScore.message || 'Nenhuma recomendação necessária. O score já é o máximo possível.' }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { grafenoAPI, pythonAPI } from '@/base_url/baseUrlNode';
  
  export default {
    setup() {
      // Inicializando as variáveis reativas
      const username = ref(localStorage.getItem('username')); // Obtém o nome do usuário do localStorage
      const endorserScore = ref({
        recommended_changes: [],
        success: false,
        message: '',
      });
      const estimatedScore = ref(0);
  
      // Função para buscar o Score do Endorser
      const fetchEndorserScore = async () => {
        try {
          const response = await grafenoAPI.get(`/score/${username.value}`);
  
          if (response.data.score && response.data.score.length > 0) {
            const scoreData = response.data.score[0];
            estimatedScore.value = scoreData.finalScore;
  
            // Definindo as variáveis de endorserScore
            endorserScore.value = {
              ongoing_transactions: scoreData.inputVariables.ongoing_transactions,
              successful_transactions: scoreData.inputVariables.successful_transactions,
              voided_transactions: scoreData.inputVariables.voided_transactions,
              non_voided_transactions: scoreData.inputVariables.non_voided_transactions,
              renegotiation_delay_days: scoreData.inputVariables.renegotiation_delay_days,
              median_installment_amount: scoreData.inputVariables.median_installment_amount,
              segment_services_count: scoreData.inputVariables.segment_services_count,
              segment_products_count: scoreData.inputVariables.segment_products_count,
              overall_transactions: scoreData.inputVariables.overall_transactions,
              score: scoreData.finalScore
            };
  
            // Aqui você pode realizar a chamada para a IA para obter recomendações baseadas nos dados de score
            getRecommendations(endorserScore.value);
          }
        } catch (error) {
          console.error('Erro ao buscar o score do endorser:', error);
        }
      };
  
      // Função para obter as recomendações do backend com base nos dados de score
      const getRecommendations = async (scoreData) => {
        try {
          const response = await pythonAPI.post('/recomendation-score', scoreData);
  
          // Atualizando o estado com as recomendações
          endorserScore.value.recommended_changes = response.data.recommended_changes || [];
          endorserScore.value.message = response.data.message || '';
        } catch (error) {
          console.error('Erro ao obter recomendações de score:', error);
        }
      };
  
      // Executando a função ao montar o componente
      onMounted(() => {
        fetchEndorserScore();
      });
  
      return {
        endorserScore,
        estimatedScore,
      };
    },
  };
  </script>

<style scoped>
.my-4 {
  margin: 16px 0;
}
</style>  