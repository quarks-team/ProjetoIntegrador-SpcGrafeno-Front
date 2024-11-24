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

    <!-- Barra de Navegação -->
    <v-app-bar app color="green lighten-3" flat>
      <v-container class="d-flex justify-center align-center">
        <div class="spc-score">
          <v-toolbar-side-icon>
            <v-icon class="icon" large>mdi-file-upload</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title> Documentos para Histórico de Duplicatas </v-toolbar-title>
        </div>
      </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <!-- Seção de Upload de Arquivo -->
      <v-container class="background-image" fluid>
        <v-card>
          <v-card-title>Upload de Arquivo CSV</v-card-title>
          <v-card-text>
            <v-file-input label="Selecione um arquivo .csv" accept=".csv" v-model="file" @change="validateFile" />
            <v-btn :disabled="!file" color="primary" @click="uploadFile">
              Iniciar Upload
            </v-btn>
            <v-progress-linear v-if="isUploading" :value="uploadProgress" height="6" color="blue"></v-progress-linear>
            <v-alert v-if="message" :type="alertType">{{ message }}</v-alert>
          </v-card-text>
        </v-card>
        <div id="forecast-chart" style="height: 400px;"></div>
      </v-container>
    </v-main>

  </v-app>

</template>

<script>
import { ref, onMounted  } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { pythonAPI } from '@/base_url/baseUrlNode';
import Plotly from "plotly.js-dist";

export default {
  setup() {
    const file = ref(null);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const message = ref("");
    const alertType = ref("info");
    const username = ref(localStorage.getItem("username"));
    const router = useRouter();
    const drawer = ref(true);
    const payloadPrevisao = ref({});

    const chartData = ref({ history: [], forecast: [] });

    const validateFile = () => {
      const validTypes = ["text/csv"];
      if (!validTypes.includes(file.value?.type)) {
        message.value = "Apenas arquivos CSV são permitidos.";
        alertType.value = "error";
        file.value = null;
      } else {
        message.value = "";
      }
    };

    const uploadFile = async () => {
      if (!file.value) return;

      const data = {
        duplicate_state: "finished",
        day: 30,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("file", file.value);

      isUploading.value = true;
      message.value = "Upload em andamento...";
      alertType.value = "info";

      try {
        const response = await axios.post("http://localhost:8000/generate_model/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        });

        // Atualize o valor de payloadPrevisao com .value
        payloadPrevisao.value = response.data; // Atribuindo corretamente ao .value

        message.value = response.data.message || "Processamento concluído!";
        alertType.value = "success";

        // Após o upload bem-sucedido, carregue os dados do backend para o gráfico
        loadDataFromAPI();

      } catch (error) {
        console.log(error);
        message.value = error.response?.data?.message || "Erro no upload.";
        alertType.value = "error";
      } finally {
        isUploading.value = false;
        uploadProgress.value = 0;
      }
    };

    const loadDataFromAPI = () => {
      chartData.value = {
        history: Object.keys(payloadPrevisao.value.ds).map((key) => ({
          date: payloadPrevisao.value.ds[key],
          value: payloadPrevisao.value.yhat[key],
        })),
        forecast: Object.keys(payloadPrevisao.value.ds).map((key) => ({
          date: payloadPrevisao.value.ds[key],
          value: payloadPrevisao.value.yhat[key],
        })),
      };
      renderChart();
    };

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
      // Inicializa o gráfico vazio
      renderChart();
    });
    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    return {
      navigateTo,
      file,
      isUploading,
      uploadProgress,
      message,
      alertType,
      chartData,
      validateFile,
      uploadFile,
      drawer: true,
    };
  },
};
</script>


<style scoped>
.v-file-input {
  margin-bottom: 16px;
}

.v-btn {
  margin-top: 8px;
}

.v-navigation-drawer {
  width: 200px;
  background-color: #1679AB;
}

.v-card {
  padding: 64px;
}

.drawer-text {
  color: white !important;
}

.background-image {
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

.spc-score {
  display: flex;
  align-items: center;
}

.spc-score .icon {
  margin-right: 4px;
  font-size: 35px;
}
</style>