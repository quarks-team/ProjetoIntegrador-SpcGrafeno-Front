<template>
  <v-app>
    <!-- Navbar -->
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
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
        <v-icon class="icon" large>mdi-tune</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title> Configurações </v-toolbar-title>
    </div>
  </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="background-image">
        <v-row justify="center" align="center" class="min-height">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="mx-auto" flat>
            <v-card-title>Configurações de Consentimento</v-card-title>
            <v-card-text>
            <!-- Exibir mensagem enquanto os itens não são carregados -->
            <template v-if="currentTermItems.length === 0">
              <v-alert type="info">Nenhum item encontrado para o termo ativo.</v-alert>
            </template>

            <!-- Renderizar itens quando carregados -->
            <v-list v-else>
              <v-list-item v-for="(item, index) in currentTermItems" :key="index">
                <v-list-item-content>
                  <v-list-item-title>
                    <strong>Item:</strong> {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <strong>Descrição:</strong> {{ item.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Tag:</strong> {{ item.tag }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong>Obrigatório:</strong> {{ item.isMandatory ? 'Sim' : 'Não' }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-checkbox v-model="selectedPolicies" :value="item.tag" :disabled="item.isMandatory"
                    :label="item.isMandatory ? 'Obrigatório' : 'Opcional'"></v-checkbox>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="savePolicies" color="primary">Atualizar Consentimento</v-btn>
            <v-btn color="secondary" @click="redirectToTermsPage">Ver Termo Completo</v-btn>
          </v-card-actions>
        </v-card>

        <div style="position: relative;">
          <!-- Botão para salvar em PDF -->
          <v-btn @click="exportTermoAtualToPDF" color="primary">
            Salvar Histórico em PDF
          </v-btn>

          <!-- Card do Histórico -->
          <v-card class="mt-5" id="cardTermoHistorico">
            <v-card-title>
              <span class="headline">Histórico de Consentimentos</span>
            </v-card-title>
            <v-card-subtitle>Veja seu histórico completo de aceites:</v-card-subtitle>
            <v-card-text>
              <!-- Lista de históricos de consentimento -->
              <v-list>
                <v-list-item-group v-if="userConsentHistory.length > 0">
                  <v-list-item v-for="(consent, index) in userConsentHistory" :key="consent._id">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ consent.terms.description }} (Versão {{ consent.terms.version }})
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Aceite em: {{ new Date(consent.updatedAt).toLocaleString() }}
                      </v-list-item-subtitle>
                      <v-list-item-subtitle>
                        Status: {{ consent.isActive ? "Ativo" : "Inativo" }}
                      </v-list-item-subtitle>
                      <!-- Exibição dos itens do termo -->
                      <v-divider class="mt-2"></v-divider>
                      <v-list>
                        <v-list-item v-for="(item, itemIndex) in consent.terms.items" :key="itemIndex">
                          <v-list-item-content>
                            <v-list-item-title>Item: {{ item.name }}</v-list-item-title>
                            <v-list-item-subtitle>Descrição: {{ item.description }}</v-list-item-subtitle>
                            <v-list-item-subtitle>Tag: {{ item.tag }}</v-list-item-subtitle>
                            <v-list-item-subtitle>
                              Obrigatório: {{ item.isMandatory ? "Sim" : "Não" }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <v-list-item-subtitle>
                        <strong>Restrições:</strong>
                        <span v-if="consent.terms.restrictions.length > 0">
                          {{ consent.terms.restrictions.join(", ") }}
                        </span>
                        <span v-else>
                          Não há restrições
                        </span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
                <v-alert v-else type="info">
                  Nenhum histórico de consentimento encontrado.
                </v-alert>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
        </v-col>
      </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { grafenoAPI } from "@/base_url/baseUrlNode";
import html2pdf from "html2pdf.js";

export default {
  setup() {
    const drawer = ref(true);
    const currentTermItems = ref([]);
    const selectedPolicies = ref([]);
    const username = ref(localStorage.getItem('username'));
    const userConsentHistory = ref([]);
    const router = useRouter();
    const activeTerm = ref();

    const fetchCurrentTerm = async () => {
      try {
        const response = await grafenoAPI.get("/acceptance-terms");
        if (response.data && Array.isArray(response.data)) {
          const active = response.data.find((term) => term.isActive);
          if (active) {
            activeTerm.value = active; // Atualiza o termo ativo
            currentTermItems.value = active.items; // Atualiza os itens do termo
            await fetchConsentHistory(localStorage.getItem("userId")); // Carrega o histórico de consentimentos
          }
        }
      } catch (error) {
        console.error("Erro ao buscar os termos de aceitação:", error);
      }
    };

    // Função para buscar o histórico de consentimentos
    const fetchConsentHistory = async (userId) => {
      try {
        const response = await grafenoAPI.get(`/user-consent/${userId}`);
        userConsentHistory.value = response.data;
        // Pré-selecionar itens de consentimento com base no histórico de restrições
        if (userConsentHistory.value.length > 0) {
          const latestConsent = userConsentHistory.value[0];
          selectedPolicies.value = latestConsent.terms.restrictions; // Restrições já selecionadas
        }
      } catch (error) {
        console.error("Erro ao carregar o histórico de consentimento:", error);
      }
    };

    // Função para salvar as atualizações dos consentimentos
    const savePolicies = async () => {
      try {
        // Garantir que o termo ativo esteja carregado
        if (!activeTerm.value || !activeTerm.value._id) {
          throw new Error("Nenhum termo ativo encontrado.");
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("ID do usuário não encontrado no localStorage.");
        }

        // Calcular as restrições com base nos itens não selecionados
        const restrictions = currentTermItems.value
          .filter((item) => !selectedPolicies.value.includes(item.tag))
          .map((item) => item.tag);

        // Construir o payload
        const payload = {
          _id: userId, // ID do usuário
          acceptanceTerms: [
            {
              _id: activeTerm.value._id, // ID do termo ativo
              version: activeTerm.value.version,
              isActive: true,
              description: activeTerm.value.description,
              items: currentTermItems.value, // Todos os itens do termo
              restrictions, // Restrições calculadas
            },
          ],
        };

        // Enviar o payload para o endpoint
        const updateResponse = await grafenoAPI.patch(`/user/acceptance-terms`, payload);

        if (updateResponse.status === 200) {
          fetchConsentHistory(userId);
          alert("Consentimento atualizado com sucesso!");
        } else {
          throw new Error("Erro ao atualizar o consentimento.");
        }
      } catch (error) {
        console.error("Erro ao salvar o consentimento:", error);
      }
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };
    const logout = () => {
      localStorage.removeItem('endorserName');
      localStorage.removeItem('username');
      router.push('/login');
    };

    const exportTermoAtualToPDF = () => {
      const element = document.querySelector('#cardTermoHistorico'); // Seleciona a parte que será exportada
      const options = {
        margin: 1,
        filename: 'termo_atual.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(element).set(options).save(); // Gera e baixa o PDF
    };

    const redirectToTermsPage = function () {
      // Redireciona o usuário para a página dos termos completos
      window.open('https://github.com/quarks-team/Projeto-Integrador-SPCGrafeno/wiki/User-Acceptance-terms', '_blank');
    }

    // Carregar os dados quando a página for montada
    onMounted(() => {
      fetchCurrentTerm();
      const userId = localStorage.getItem("userId"); // Supondo que o userId esteja no localStorage
      if (userId) {
        fetchConsentHistory(userId); // Carregar o histórico de consentimento
      }
    });

    return {
      drawer,
      username,
      currentTermItems,
      selectedPolicies,
      savePolicies,
      navigateTo,
      userConsentHistory,
      logout,
      redirectToTermsPage,
      exportTermoAtualToPDF
    };
  },
};
</script>


<style scoped>
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

.background-image {
  background-image: url('@/assets/abstract.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.v-main {
  padding-top: 64px;
  /* Altura da App Bar */
}

.spc-score {
  display: flex;
  align-items: center;
}

.spc-score .icon {
  margin-right: 8px;
  font-size: 35px;
}

.logout-icon {
  margin-top: auto;
}
</style>