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
          <v-list-item-content>
            <v-list-item-title>Bem-vindo {{ username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <router-link to="/duplicatas" class="drawer-text" exact>
          <v-list-item link>
            <v-list-item-action>
              <v-icon color="white"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>DUPLICATAS</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>

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
        <v-icon class="icon" large>mdi-calendar-arrow-right</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title> Predição de Duplicatas </v-toolbar-title>
    </div>
  </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row justify="center" align="center">
          <v-col cols="12" md="6">
            <v-card
              class="mx-auto"
              :style="{ backgroundColor: '#DEF9C4' }"
              flat
            >
              <v-card-title class="text-center"
                >Calcular Probabilidade de Duplicata</v-card-title
              >

              <v-card-text>
                <v-form ref="form" v-model="valid">
                  <div class="form-row">
                    <br>
                    <div class="form-group col-md-6">
                      <label for="createdAt" class="form-label"
                        >Data de Criação:</label
                      >
                      <input
                        type="date"
                        v-model="duplicata.createdAt"
                        class="form-control"
                        required
                      />
                    </div>
                    <br>
                  </div>

                  <div class="form-row">
                    <br>
                    <div class="form-group col-md-6">
                      <label for="dueDate" class="form-label"
                        >Data de Vencimento:</label
                      >
                      <input
                        type="date"
                        v-model="duplicata.dueDate"
                        class="form-control"
                        required
                      />
                    </div>
                    <br>
                  </div>

                  <v-select
                    v-model="duplicata.segmento"
                    :items="segmentos"
                    label="Segmento"
                    :rules="[rules.required]"
                    required
                  ></v-select>

                  <v-select
                    v-model="duplicata.areasDeAtuacao"
                    :items="areas"
                    label="Área de Atuação"
                    :rules="[rules.required]"
                    multiple
                    required
                  ></v-select>

                  <v-select
                    v-model="duplicata.estado"
                    :items="estados"
                    label="Estado"
                    :rules="[rules.required]"
                    required
                  ></v-select>

                  <!-- Button to Calculate Probability -->
                  <button
                    type="submit"
                    @click.prevent="calcularProbabilidade"
                    class="btn btn-primary w-100 mt-4"
                  >
                    Calcular Probabilidade
                  </button>
                </v-form>

                <v-divider></v-divider>

                <!-- Exibir Probabilidade -->
                <div class="probabilidade-card" v-if="resultado">
                  <h3>Probabilidade de Sucesso</h3>
                  <div
                    class="probabilidade-valor"
                    :style="{ color: probabilidadeColor }"
                  >
                    {{ resultado.confianca }}%
                  </div>
                  <div
                    class="progress-bar-container"
                    style="
                      background-color: #e0e0e0;
                      border-radius: 5px;
                      overflow: hidden;
                    "
                  >
                    <div
                      class="progress-bar"
                      :style="{
                        width: resultado.confianca + '%',
                        height: '10px',
                        backgroundColor: probabilidadeColor,
                      }"
                    ></div>
                  </div>
                  <p class="probabilidade-feedback">
                    {{ feedbackProbabilidade }}
                  </p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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
    const duplicata = ref({
      dueDate: "",
      createdAt: "",
      segmento: "",
      areasDeAtuacao: [],
      estado: "",
    });

    const resultado = ref(null);
    const valid = ref(false);
    const drawer = ref(true);
    const username = ref(localStorage.getItem("username"));
    const router = useRouter();

    const segmentos = ["produto", "serviço"];
    const areas = [
      "COMERCIO",
      "INDUSTRIA",
      "DISTRIBUIDORA",
      "PRODUTOS",
      "PLASTICOS",
      "QUIMICA",
      "SERVIÇOS",
      "ALIMENTOS",
      "METAIS",
      "EMBALAGENS",
      "TEXTIL",
      "ELETRONICO",
      "ELETRICS",
      "AGRICOLAS",
      "MEDICAMENTOS",
      "FRIGORIFICO",
      "PECAS",
      "LOGISTICA",
      "COMPONENTES",
      "AGROPECUARIA",
      "TRADING",
      "BEBIDAS",
      "SUPRIMENTOS",
      "TRANSPORTE",
      "SIDERURGICOS",
      "FARMACIA",
      "DIAGNOSTICOS",
      "CONSTRUCOES",
      "CONSULTORIA",
      "FINANCEIRA",
      "ARGAMASSA",
      "FABRICAN",
      "PETROLEO",
      "TERMOPLASTICOS",
      "METALURGICOS",
      "SUPLEMENTOS",
      "FUNDICAO",
      "VEICULOS",
      "EQUIPAMENTOS",
    ];
    const estados = [
      "AL",
      "AM",
      "AP",
      "BA",
      "CE",
      "ES",
      "GO",
      "MG",
      "MS",
      "PA",
      "PI",
      "PR",
      "RJ",
      "RS",
      "SC",
      "SE",
      "SP",
      "TO",
    ];

    const rules = {
      required: (value) => !!value || "Campo obrigatório.",
    };

    const feedbackProbabilidade = ref("");
    const probabilidadeColor = ref("#000"); // Default color

    const calcularProbabilidade = async () => {
      if (valid.value) {
        let dueDate = new Date(duplicata.value.dueDate);
        let month = dueDate.getMonth() + 1;
        let quarter = Math.ceil(month / 3);

        const payload = {
          segment: duplicata.value.segmento,
          month,
          quarter,
          area: duplicata.value.areasDeAtuacao,
          date: dueDate.toLocaleDateString("en-GB"),
          created_date: new Date(duplicata.value.createdAt).toLocaleDateString(
            "en-GB"
          ),
          state: duplicata.value.estado,
        };

        console.log("Payload para a rota:", payload);

        try {
          const response = await axios.post(
            "http://localhost:8000/predict-duplicate/",
            payload
          );
          resultado.value = response.data;

          console.log("Json de retorno:", response.data);

          // Ajuste aqui para usar 'probability' em vez de 'confianca'
          const confidence = resultado.value.probability * 100; // Transformar para porcentagem
          feedbackProbabilidade.value =
            confidence > 70
              ? "Alta probabilidade de sucesso!"
              : "Baixa probabilidade de sucesso.";
          probabilidadeColor.value = confidence > 70 ? "green" : "red";

          // Atualiza o resultado para exibir a confiança
          resultado.value.confianca = confidence; // Adiciona 'confianca' ao objeto para usar na exibição
        } catch (error) {
          console.error("Erro ao calcular a probabilidade:", error);
        }
      }
    };

    const logout = () => {
      localStorage.removeItem("username");
      router.push("/login");
    };

    const goHome = () => {
      router.push("/home");
    };

    const navigateTo = (page) => {
      const routes = {
        contratos: "/contratos",
        config: "/config",
        duplicatas: "/duplicatas",
      };

      const route = routes[page] || "/home";
      router.push(route);
    };

    return {
      duplicata,
      resultado,
      valid,
      drawer,
      username,
      segmentos,
      areas,
      estados,
      rules,
      feedbackProbabilidade,
      probabilidadeColor,
      calcularProbabilidade,
      logout,
      goHome,
      navigateTo,
    };
  },
};
</script>

<style scoped>
.progress-bar-container {
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar {
  height: 10px;
  background-color: green; /* Default background color */
}

.probabilidade-card {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9; /* Light background color */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
