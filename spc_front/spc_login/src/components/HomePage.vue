<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="goHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>Bem vindo {{ username }}</v-list-item-title>
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

        <v-list-item link @click="navigateTo('config')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>CONFIGURAÇÕES</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-spacer></v-spacer>
        
        <v-btn
        @click="logout"
        class="logout-icon"
        color="white"
        fab
        icon
      >
      <v-icon>mdi-logout</v-icon>
      </v-btn>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="green lighten-3" flat>
      <v-toolbar-side-icon>
        <v-icon>fas fa-tachometer-alt</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title>
        SPC Score
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="background-image">
        <v-row justify="center" align="center" class="min-height">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="mx-auto" :style="{backgroundColor: '#DEF9C4'}" flat>
              <v-card-title class="text-center">
                Seu Score está {{ scoreText }}
              </v-card-title>
              <v-card-subtitle class="text-center display-3">
                <span>{{ score }}</span> de 10000
              </v-card-subtitle>
              <v-divider></v-divider>
              
              <v-progress-circular
              :value="scorePercentage"
              :size="150"
              color="blue"
              class="mx-auto"
            >
              {{ scorePercentage.toFixed(0) }}%
            </v-progress-circular>
            </v-card>
          </v-col>

          <v-col cols="12" md="6" class="text-center">
            <v-card flat>
              <v-card-title class="text-center">
                HISTÓRICO DE CONTRATOS
              </v-card-title>
              <v-card-text v-if="endorserScore">
                <!-- Barra de Progresso Linear para Aberto -->
              <v-progress-linear
                :value="getProgressValue(endorserScore?.active)"
                :height="20"
                color="blue"
                class="mb-2"
              >
                Aberto {{ endorserScore?.active !== null ? endorserScore.active : 0 }}
              </v-progress-linear>

              <!-- Barra de Progresso Linear para Fechado -->
              <v-progress-linear
                :value="getProgressValue(endorserScore?.finished)"
                :height="20"
                color="green"
                class="mb-2"
              >
                Fechado {{ endorserScore?.finished !== null ? endorserScore.finished : 0 }}
              </v-progress-linear>

              <!-- Barra de Progresso Linear para Cancelado -->
              <v-progress-linear
                :value="getProgressValue(endorserScore?.canceled)"
                :height="20"
                color="red"
                class="mb-2"
              >
                Cancelado {{ endorserScore?.canceled !== null ? endorserScore.canceled : 0 }}
              </v-progress-linear>
              </v-card-text>
              <v-card-text v-else>
                Carregando dados...
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
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const score = ref(0);
    const scoreText = ref("");
    const scorePercentage = ref(0);
    const drawer = ref(true);
    const cnpj = ref(localStorage.getItem('cnpj'));
    const endorserScore = ref({ active: 0, finished: 0, canceled: 0 });
    const router = useRouter();
    const username = ref(localStorage.getItem('username'));

    // Função para buscar o score do back-end
    const fetchEndorserScore = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/score/${cnpj.value}`);
        score.value = response.data.score[0]["score"];
        updateScoreText();
        scorePercentage.value = (score.value / 10000) * 100;
        endorserScore.value = response.data.score[0];
      } 
      catch (error) {
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

    const getProgressValue = (value) => {
      return (value / 100) * 100;
    };

    const logout = () => {
      localStorage.removeItem('cnpj');
      localStorage.removeItem('username');
      router.push('/login');
    };

    onMounted(() => {
      fetchEndorserScore();
});

    return {
      drawer,
      score,
      scoreText,
      scorePercentage,
      cnpj,
      endorserScore,
      username,
      logout,
      getProgressValue,

      navigateTo: (page) => {
        if (page === 'contratos') {
          router.push('/contratos');
        } else if (page === 'config') {
          router.push('/config');
        }
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

.background-image{
  background-image: url('@/assets/abstract.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.min-height {
  min-height: 100vh;
}
.logout-icon {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
</style>
