<template>
    <v-app>
      <v-navigation-drawer app v-model="drawer" permanent>
        <v-list dense>
          <v-list-item link @click="navigateTo('contratos')">
            <v-list-item-action>
              <v-icon>mdi-file-document</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Contratos</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
  
          <v-list-item link @click="navigateTo('configuracoes')">
            <v-list-item-action>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Configurações</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- Barra de Título -->
      <v-app-bar>
        <!-- Botão de voltar para Home -->
        <v-btn icon @click="goHome">
          <v-icon>mdi-home</v-icon>
        </v-btn>
  
        <!-- Logotipo centralizado -->
        <v-spacer></v-spacer>
        <v-img
          src="@/assets/logo_spc.jpg"
          alt="Logo"
          max-width="100"
        ></v-img>
        <v-spacer></v-spacer>
  
        <!-- Campo de Pesquisa -->
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </v-app-bar>
  
      <!-- Conteúdo da Home -->
      <v-main>
        <v-container fluid class="home-page">
          <v-row align="center" justify="center">
            <v-col cols="12" md="8" class="text-center">
              <h1 class="white--text">Bem-vindo ao SPC Score</h1>
            </v-col>
          </v-row>
  
          <!-- Seção de Informações -->
          <v-row justify="center">
            <v-col cols="12" md="8">
              <v-card class="px-4 py-4">
                <v-card-title class="headline">
                  Histórico de Contratos
                </v-card-title>
                <v-card-text>
                  <!-- Gráfico de Barras -->
                  <canvas id="barChart" height="200"></canvas>
  
                  <!-- Gráfico de Velocímetro -->
                  <h3>Seu Score:</h3>
                  <canvas id="gaugeChart" height="200"></canvas>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import { Gauge } from "chartjs-gauge";
  import { Chart } from "chart.js/auto";
  
  export default {
    data() {
      return {
        search: "",
        drawer: false, // Controle do menu lateral
        contractsPerMonth: [12, 19, 3, 5, 2, 3, 7, 12, 6, 9, 15, 8], // Exemplo de contratos abertos por mês
      };
    },
    mounted() {
      this.renderGauge();
      this.renderBarChart();
    },
    methods: {
      goHome() {
        // Lógica para navegar para a Home
        this.$router.push("/");
      },
      renderGauge() {
        // Inicializando o gráfico de velocímetro com o Chart.js e Chartjs-Gauge
        const ctx = document.getElementById("gaugeChart").getContext("2d");
        new Gauge(ctx, {
          type: "gauge",
          data: {
            datasets: [
              {
                value: 65, // Score atual do usuário (exemplo)
                data: [0, 20, 40, 60, 80, 100],
                backgroundColor: ["#ff6e6e", "#ffb26b", "#ffe66d", "#b8e986", "#62d0ff"],
              },
            ],
          },
          options: {
            responsive: true,
            layout: {
              padding: {
                bottom: 20,
              },
            },
            needle: {
              radiusPercentage: 2,
              widthPercentage: 3.2,
              lengthPercentage: 80,
              color: "#000000",
            },
            valueLabel: {
              display: true,
              formatter: (value) => `${value}%`, // Exibe o valor do score em porcentagem
            },
          },
        });
      },
      renderBarChart() {
        // Inicializando o gráfico de barras
        const ctx = document.getElementById("barChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: [
              'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
              'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
            ],
            datasets: [
              {
                label: 'Contratos Abertos',
                data: this.contractsPerMonth, // Dados de contratos por mês
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1, // Define um incremento mínimo no eixo Y
                },
              },
            },
          },
        });
      },
      navigateTo(page) {
        this.$router.push(`/${page}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .v-app-bar {
    background-color: rgba(222, 249, 196, 1);
  }
  
  .home-page {
    background-image: url("@/assets/abstract.jpg");
    background-size: cover;
    background-position: center;
    height: 100vh;
  }
  
  .fill-height {
    height: 100%;
  }
  
  .v-card {
    background-color: white;
    color: black;
  }
  
  .v-card-title {
    font-weight: bold;
  }
  
  .v-card-text {
    font-size: 16px;
    line-height: 1.6;
  }
  </style>
  
  