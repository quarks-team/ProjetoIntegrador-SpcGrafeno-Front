<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      permanent
      class="drawer-background"
    >
      <v-list>
        <v-list-item>
          <v-btn icon @click="navigateTo('home')">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-list-item-content>
            <v-list-item-title>Bem vindo {{ username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item link @click="navigateTo('duplicatas')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-calendar-clock</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>DUPLICATAS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="navigateTo('data-previsao')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-cached</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>HISTÓRICO DE DUPLICATAS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="navigateTo('config')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>CONFIGURAÇÕES</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-spacer></v-spacer>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="green lighten-3" flat>
      <v-container class="d-flex justify-center align-center">
        <div class="spc-score">
          <v-toolbar-side-icon>
            <v-icon class="icon" large>mdi-cached</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>Histórico de Duplicatas</v-toolbar-title>
        </div>
      </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- Gráfico com Histórico e Previsão -->
        <div id="forecast-chart" style="height: 400px;"></div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Plotly from "plotly.js-dist";

export default {
  setup() {
    const drawer = ref(true);
    const username = ref(localStorage.getItem("username"));
    const chartData = ref({ history: [], forecast: [] });

    const navigateTo = (page) => {
      console.log(`Navegando para: ${page}`);
    };

    // Função para carregar os dados do backend
    const loadDataFromAPI = async () => {
      try {
        const response = await axios.get("http://localhost:3000/");
        const backendData = response.data.active;

        chartData.value = {
          history: Object.keys(backendData.ds).map((key) => ({
            date: backendData.ds[key],
            value: backendData.trend[key],
          })),
          forecast: Object.keys(backendData.ds).map((key) => ({
            date: backendData.ds[key],
            value: backendData.yhat[key],
          })),
        };
        renderChart();
      } catch (error) {
        console.error("Erro ao carregar os dados do backend:", error);
      }
    };

    // Função para renderizar o gráfico
    const renderChart = () => {
      const historyTrace = {
        x: chartData.value.history.map((d) => d.date),
        y: chartData.value.history.map((d) => d.value),
        type: "scatter",
        mode: "lines",
        line: { color: "green", width: 2 },
        name: "Histórico",
      };

      const forecastTrace = {
        x: chartData.value.forecast.map((d) => d.date),
        y: chartData.value.forecast.map((d) => d.value),
        type: "scatter",
        mode: "lines",
        line: { color: "blue", dash: "dot", width: 2 },
        name: "Previsão",
      };

      const layout = {
        title: "Histórico e Previsão de Duplicatas",
        xaxis: { title: "Data" },
        yaxis: { title: "Quantidade" },
        showlegend: true,
      };

      Plotly.newPlot("forecast-chart", [historyTrace, forecastTrace], layout);
    };

    onMounted(() => {
      loadDataFromAPI();
    });

    return {
      drawer,
      username,
      navigateTo,
    };
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 200px;
  background-color: #1679ab;
}

.drawer-text {
  color: white !important;
}

.spc-score {
  display: flex;
  align-items: center;
}

.spc-score .icon {
  margin-right: 4px;
  font-size: 35px;
}
</style>
