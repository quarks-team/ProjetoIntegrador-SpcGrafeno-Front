<template>
    <v-container>
      <v-card>
        <v-card-title class="headline">Previsão de Score</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="isFormValid">
            <!-- Score Alvo -->
            <v-text-field
              v-model="formData.score"
              label="Score Alvo"
              type="number"
              :rules="[rules.required, rules.positive]"
              outlined
              clearable
            ></v-text-field>
  
            <!-- Parâmetros Opcionais -->
            <v-text-field
              v-model="formData.voided_transactions"
              label="Duplicatas Canceladas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.ongoing_transactions"
              label="Duplicatas Ativas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.overall_transactions"
              label="Total de Duplicatas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.segment_products_count"
              label="Produtos por Segmento"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.segment_services_count"
              label="Serviços por Segmento"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.non_voided_transactions"
              label="Duplicatas Não Canceladas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.successful_transactions"
              label="Duplicatas Bem-Sucedidas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.renegotiation_delay_days"
              label="Dias de Atraso em Renegociações"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <v-text-field
              v-model="formData.median_installment_amount"
              label="Valor Médio de Parcelas"
              type="number"
              :rules="[rules.nonNegative]"
              outlined
              clearable
            ></v-text-field>
  
            <!-- Botões -->
            <v-btn
              color="primary"
              :disabled="!isFormValid || loading"
              @click="fetchRecommendations"
            >
              Prever Score
            </v-btn>
            <v-btn color="secondary" @click="resetForm">Limpar</v-btn>
          </v-form>
  
          <!-- Indicador de Carregamento -->
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="my-4"
          ></v-progress-circular>
  
          <!-- Mensagem de Erro -->
          <v-alert
            v-if="errorMessage"
            type="error"
            dismissible
            class="my-4"
          >
            {{ errorMessage }}
          </v-alert>
  
          <!-- Recomendações -->
          <v-list v-if="recommendations">
            <v-subheader>Recomendações</v-subheader>
            <v-divider></v-divider>
            <v-list-item
              v-for="(recommendation, key) in recommendations"
              :key="key"
            >
              <v-list-item-content>
                <v-list-item-title>{{ key }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ recommendation.justification }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-chip
                :color="recommendation.impact > 0 ? 'green' : 'red'"
                dark
              >
                {{ recommendation.impact.toFixed(2) }} pontos
              </v-chip>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        formData: {
          score: null,
          voided_transactions: 0,
          ongoing_transactions: 0,
          overall_transactions: 0,
          segment_products_count: 0,
          segment_services_count: 0,
          non_voided_transactions: 0,
          successful_transactions: 0,
          renegotiation_delay_days: 0,
          median_installment_amount: 0,
        },
        recommendations: null,
        loading: false,
        errorMessage: null,
        isFormValid: false,
        rules: {
          required: (value) => !!value || "Campo obrigatório.",
          positive: (value) =>
            value > 0 || "O score deve ser um número positivo.",
          nonNegative: (value) =>
            value >= 0 || "O valor deve ser um número não negativo.",
        },
      };
    },
    methods: {
      async fetchRecommendations() {
        this.loading = true;
        this.errorMessage = null;
        this.recommendations = null;
  
        try {
          // 1. Criar modelo
          const createModelResponse = await axios.post(
            "/create_recommendation_model"
          );
          if (!createModelResponse.data.success) {
            throw new Error("Erro ao criar o modelo de recomendação.");
          }
  
          // 2. Buscar recomendações
          const recommendationResponse = await axios.post(
            "/recomendation-score",
            this.formData
          );
  
          if (recommendationResponse.data.success) {
            this.recommendations = recommendationResponse.data.recommended_changes;
          } else {
            this.errorMessage =
              "Não foi possível prever o score com os dados fornecidos.";
          }
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message || "Erro ao conectar com a API.";
        } finally {
          this.loading = false;
        }
      },
      resetForm() {
        this.formData = {
          score: null,
          voided_transactions: 0,
          ongoing_transactions: 0,
          overall_transactions: 0,
          segment_products_count: 0,
          segment_services_count: 0,
          non_voided_transactions: 0,
          successful_transactions: 0,
          renegotiation_delay_days: 0,
          median_installment_amount: 0,
        };
        this.recommendations = null;
        this.errorMessage = null;
        this.$refs.form.resetValidation();
      },
    },
  };
  </script>

<style scoped>
.my-4 {
  margin: 16px 0;
}
</style>  