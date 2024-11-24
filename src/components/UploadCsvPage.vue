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
        <v-icon class="icon" large>mdi-file-upload</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title> Documentos </v-toolbar-title>
    </div>
  </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
    <v-container class="background-image" fluid>
      <v-card>
        <v-card-title>Upload de Arquivo CSV</v-card-title>
        <v-card-text>
          <v-file-input
            label="Selecione um arquivo .csv"
            accept=".csv"
            v-model="file"
            @change="validateFile"
          />
          <v-btn :disabled="!file" color="primary" @click="uploadFile">
            Iniciar Upload
          </v-btn>
          <v-progress-linear
            v-if="isUploading"
            :value="uploadProgress"
            height="6"
            color="blue"
          ></v-progress-linear>
          <v-alert v-if="message" :type="alertType">{{ message }}</v-alert>
        </v-card-text>
      </v-card>
    </v-container>
    </v-main>
    </v-app>
  </template>
  
  <script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

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

      const formData = new FormData();
      formData.append("file", file.value);

      isUploading.value = true;
      message.value = "Upload em andamento...";
      alertType.value = "info";

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          },
        });
        message.value = response.data.message || "Processamento concluído!";
        alertType.value = "success";
      } catch (error) {
        message.value =
          error.response?.data?.message || "Erro no upload.";
        alertType.value = "error";
      } finally {
        isUploading.value = false;
        uploadProgress.value = 0;
      }
    };

    const logout = () => {
      localStorage.removeItem("username");
      router.push("/login");
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    return {
      drawer,
      file,
      isUploading,
      uploadProgress,
      message,
      alertType,
      username,
      validateFile,
      uploadFile,
      logout,
      navigateTo,
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
  