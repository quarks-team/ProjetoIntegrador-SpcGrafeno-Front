<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
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
            <v-icon class="icon" large></v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>Histórico de Duplicatas</v-toolbar-title>
        </div>
      </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="background-image">
        <!-- Gráfico -->
        <div id="forecast-chart" class="mb-4"></div>

        <!-- Filtros -->
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedGroup"
              :items="groups"
              label="Grupo de Endossantes"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-menu
              ref="startMenu"
              v-model="datePickerStart"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="startDate"
                  label="Data Inicial"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker v-model="startDate" no-title @input="datePickerStart = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" md="4">
            <v-menu
              ref="endMenu"
              v-model="datePickerEnd"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="endDate"
                  label="Data Final"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                ></v-text-field>
              </template>
              <v-date-picker v-model="endDate" no-title @input="datePickerEnd = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>


<script>
import Plotly from "plotly.js-dist";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const drawer = ref(true);
    const username = ref(localStorage.getItem("username"));
    const router = useRouter();

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    const renderForecastChart = () => {
      const data = [
        {
          x: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"],
          y: [100, 200, 300, 400, 300, 200],
          mode: "markers",
          name: "Pontos Reais",
        },
        {
          x: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"],
          y: [110, 190, 310, 420, 280, 210],
          mode: "lines",
          name: "Previsão",
        },
        {
          x: ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06"],
          y: [90, 170, 290, 380, 250, 190],
          mode: "lines",
          name: "Intervalo de Confiança Inferior",
          line: { dash: "dot", color: "blue" },
        },
      ];

      const layout = {
        title: "Histórico e Previsão de Duplicatas",
        xaxis: { title: "Tempo" },
        yaxis: { title: "Duplicatas" },
        showlegend: true,
      };

      Plotly.newPlot("forecast-chart", data, layout);
    };

    onMounted(() => {
      renderForecastChart();
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

.background-image {
  background-image: url("@/assets/abstract.jpg");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

#forecast-chart {
  width: 100%;
  height: 500px;
}
</style>
