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

        <v-list-item link @click="navigateTo('upload')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-file-upload</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>DOCUMENTOS</v-list-item-title>
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

        <v-btn @click="logout" class="logout-icon" color="white" fab icon>
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="green lighten-3" flat>
      <v-container class="d-flex justify-center align-center">
      <div class="spc-score">
      <v-toolbar-side-icon>
        <v-icon class="icon" large>mdi-speedometer</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title> SPC Score </v-toolbar-title>
    </div>
  </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="background-image">
        <v-row justify="center" align="center" class="min-height">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="mx-auto" flat>
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
                :value="getProgressValue(endorserScore?.ongoing_transactions)"
                :height="20"
                color="blue"
                class="mb-2"
              >
                Ativas {{ endorserScore?.ongoing_transactions !== null ? endorserScore.ongoing_transactions : 0 }}
              </v-progress-linear>

              <!-- Barra de Progresso Linear para Fechado -->
              <v-progress-linear
                :value="getProgressValue(endorserScore?.successful_transactions)"
                :height="20"
                color="green"
                class="mb-2"
              >
                Concluída {{ endorserScore?.successful_transactions !== null ? endorserScore.successful_transactions : 0 }}
              </v-progress-linear>

              <!-- Barra de Progresso Linear para Cancelado -->
              <v-progress-linear
                :value="getProgressValue(endorserScore?.voided_transactions)"
                :height="20"
                color="red"
                class="mb-2"
              >
                Cancelado {{ endorserScore?.voided_transactions !== null ? endorserScore.voided_transactions : 0 }}
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
import { useRouter } from "vue-router";
import { grafenoAPI} from "@/base_url/baseUrlNode";

export default {
  setup() {
    const score = ref(0);
    const scoreText = ref("");
    const scorePercentage = ref(0);
    const drawer = ref(true);
    const endorserName = ref(localStorage.getItem('endorserName'));
    const router = useRouter();
    const username = ref(localStorage.getItem('username'));
    const endorserScore = ref(null);

    const logout = () => {
      localStorage.removeItem('endorserName');
      localStorage.removeItem('username');
      router.push('/login');
    };

    const navigateTo = (page) => {
          router.push(`/${page}`);
        };

    // Função para buscar o score do back-end
    const fetchEndorserScore = async () => {
      try {
        const response = await grafenoAPI.get(`/score/${username.value}`);

        if (response.data.score && response.data.score.length > 0){
          const scoreData = response.data.score[0];
          score.value = scoreData.finalScore;
          updateScoreText();
          scorePercentage.value = (score.value / 10000) * 100;

          endorserScore.value = {
            ongoing_transactions: scoreData.inputVariables.ongoing_transactions,
            successful_transactions: scoreData.inputVariables.successful_transactions,
            voided_transactions: scoreData.inputVariables.voided_transactions,
          };
        } else {
          console.error('Nenhum score encontrado na resposta');
        }
        
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

    onMounted(() => {
      fetchEndorserScore();
    });

    return {
      drawer,
      score,
      scoreText,
      scorePercentage,
      endorserName,
      username,
      logout,
      getProgressValue,
      endorserScore,
      navigateTo
    };
  },
};
</script>

<style scoped>
.v-navigation-drawer {
  width: 200px;
  background-color: #1679ab;
}

.v-card {
  padding: 20px;
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

.min-height {
  min-height: 100vh;
}
.logout-icon {
  position: fixed;
  bottom: 20px;
  left: 20px;
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
