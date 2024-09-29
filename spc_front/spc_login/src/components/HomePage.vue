<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="goHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>Bem vindo &lt;empresa&gt;</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item link @click="navigateTo('contratos')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-file-document</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>CONTRATOS</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link @click="navigateTo('configuracoes')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>CONFIGURAÇÕES</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-spacer></v-spacer>
        
        <v-list-item link @click="logout" class="drawer-text">
          <v-list-item-avatar>
            <v-icon color="white">mdi-power</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="light-green lighten-4" flat>
      <v-toolbar-title>
        <v-icon>mdi-clock</v-icon>
        SPC Grafeno
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon>mdi-magnify</v-icon>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="6">
            <v-card class="mx-auto" color="light-green lighten-5" flat>
              <v-card-title class="text-center">
                Seu Score está {{ scoreText }}
              </v-card-title>
              <v-card-subtitle class="text-center display-3">
                <span>{{ score }}</span> de 10000
              </v-card-subtitle>
              <v-progress-circular
                :size="150"
                :width="15"
                color="green"
                :value="scorePercentage"
              >
              </v-progress-circular>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card flat>
              <v-card-title class="text-center">
                HISTÓRICO DE CONTRATOS
              </v-card-title>
              <v-card-text>
                <canvas id="contractsChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  setup() {
    const score = ref(0);
    const scoreText = ref("");
    const drawer = ref(true);
    const cnpj = ref("12345678000123"); // Supondo que o CNPJ do usuário logado é recuperado aqui

    // Função para buscar o score do back-end
    const fetchEndorserScore = async () => {
      try {
        const response = await axios.get(`/api/endorser-score?cnpj=${cnpj.value}`);
        score.value = response.data.score;
        updateScoreText();
      } catch (error) {
        console.error("Erro ao buscar o score:", error);
      }
    };

    // Atualiza o texto com base no valor do score
    const updateScoreText = () => {
      if (score.value >= 8000) {
        scoreText.value = "alto";
      } else if (score.value >= 5000) {
        scoreText.value = "médio";
      } else {
        scoreText.value = "baixo";
      }
    };

    onMounted(() => {
      fetchEndorserScore();

      const ctx = document.getElementById("contractsChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan 2014", "Fev 2014", "Mar 2014", "Abr 2014", "Mai 2014", "Jun 2014"],
          datasets: [
            {
              label: "Aberto",
              data: [8, 5, 9, 6, 7, 10],
              backgroundColor: "blue",
            },
            {
              label: "Fechado",
              data: [12, 8, 15, 10, 16, 6],
              backgroundColor: "green",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });

    return {
      drawer,
      score,
      scoreText,
      scorePercentage: ref((score.value / 10000) * 100), // Converte o score (0-10000) para uma porcentagem (0-100)
      goHome: () => {
        // Navegação para home
      },
      navigateTo: (page) => {
        // Navegação para outras páginas
      },
      logout: () => {
        // Função de logout
      },
    };
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 200px;
  background-color: #1679AB;
}

.v-card {
  padding: 20px;
}

.drawer-text {
  color: white !important;
}
</style>
