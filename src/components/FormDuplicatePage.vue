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
            <v-list-item-title>Bem-vindo {{ username }}</v-list-item-title>
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
        <v-icon class="icon" large>mdi-calendar-arrow-right</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title> Predição de Duplicatas </v-toolbar-title>
    </div>
  </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height background-image" fluid>
        <v-row class="d-flex justify-center align-center" style="min-height: 100vh;">
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <span class="headline">Calcular a Probabilidade</span>
              </v-card-title>
              <v-divider></v-divider>

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
                  <v-btn
                    type="submit"
                    @click.prevent="calcularProbabilidade"
                    color="primary"
                  >
                    Calcular
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                     @click="limparFormulario"
                      color="red"
                      >
                      Limpar
                  </v-btn>
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
      "COMERCIO", "INDUSTRIA", "DISTRIBUIDORA", "PRODUTOS", "PLASTICOS", "QUIMICA", "SERVIÇOS", "ALIMENTOS",
      "METAIS", "EMBALAGENS", "TEXTIL", "ELETRONICO", "ELETRICS", "AGRICOLAS", "MEDICAMENTOS", "FRIGORIFICO",
      "PECAS", "LOGISTICA", "COMPONENTES", "AGROPECUARIA", "TRADING", "BEBIDAS", "SUPRIMENTOS", "TRANSPORTE",
      "SIDERURGICOS", "FARMACIA", "DIAGNOSTICOS", "CONSTRUCOES", "CONSULTORIA", "FINANCEIRA", "ARGAMASSA",
      "FABRICAN", "PETROLEO", "TERMOPLASTICOS", "METALURGICOS", "SUPLEMENTOS", "FUNDICAO", "VEICULOS", "EQUIPAMENTOS",
    ];
    const estados = [
      "AL", "AM", "AP", "BA", "CE", "ES", "GO", "MG", "MS", "PA", "PI", "PR", "RJ", "RS", "SC", "SE", "SP", "TO",
    ];

    const rules = {
      required: (value) => !!value || "Campo obrigatório.",
    };

    const feedbackProbabilidade = ref("");
    const probabilidadeColor = ref("#000");

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
    
    const limparFormulario = () => {
      duplicata.value = {
        dueDate: "",
        createdAt: "",
        segmento: "",
        areasDeAtuacao: [],
        estado: "",
      };
      resultado.value = null;
      feedbackProbabilidade.value = "";
      probabilidadeColor.value = "#000";
    };

    const logout = () => {
      localStorage.removeItem("username");
      router.push("/login");
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
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
      limparFormulario,
      logout,
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
  background-color: #B9E5E8; /* Light background color */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.v-chip {
  margin-left: 10px;
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
.spc-score {
  display: flex;
  align-items: center;
}
.spc-score .icon {
  margin-right: 4px;
  font-size: 35px;
}
</style>
