<template>
  <v-app>
    <!-- Menu Lateral -->
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="navigateTo('home')">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-list-item-content>
            <v-list-item-title>Bem vindo {{ username || 'Usuário' }}</v-list-item-title>
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
            <v-icon class="icon" large>mdi-account-check</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title>Gerenciamento de Consentimento</v-toolbar-title>
        </div>
      </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Conteúdo Principal -->
    <v-main>
      <v-container fluid>
        <v-card>
          <v-card-title>Gerenciar Permissões e Restrições</v-card-title>
          <v-card-subtitle>Revise e gerencie as permissões para o uso dos seus dados.</v-card-subtitle>
          <v-card-text>
            <v-form v-model="valid">
              <v-list dense>
                <v-subheader>Termos e Condições</v-subheader>
                <v-list-item v-for="policy in policies" :key="policy.id">
                  <v-list-item-content>
                    <v-list-item-title>Política {{ policy.id }}</v-list-item-title>
                    <v-list-item-subtitle>{{ policy.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox v-if="!policy.isMandatory" v-model="policy.isActive"
                      :label="policy.isActive ? 'Aceito' : 'Revogado'"></v-checkbox>
                    <v-chip v-if="policy.isMandatory" label color="red" class="ml-2">
                      Obrigatório
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="savePolicies">Salvar Alterações</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>

      <v-container fluid>
        <div class="text-right mt-4">
          <v-btn color="primary" @click="exportTermoAtualToPDF">Exportar histórico para PDF</v-btn>
        </div>
        <v-card id="cardTermoHistorico">
          <v-card-title class="text-h5">Histórico de Consentimento</v-card-title>
          <v-card-text>
            <div v-if="userHistorycal && userHistorycal.length > 0">
              <v-list>
                <!-- Ordena o histórico pelo campo de data (decrescente) -->
                <v-list-item
                  v-for="(consent, index) in [...userHistorycal].sort((a, b) => new Date(b.terms[0].createdAt) - new Date(a.terms[0].createdAt))"
                  :key="consent._id" class="mb-4">
                  <v-card flat outlined>
                    <v-card-title class="text-h6">
                      {{ index + 1 }} - {{ username }} aceitou o termo
                    </v-card-title>
                    <v-card-subtitle>
                      <strong>Descrição:</strong> {{ consent.terms[0].description }}
                    </v-card-subtitle>
                    <v-card-subtitle>
                      <strong>Versão:</strong> {{ consent.terms[0].version }}
                    </v-card-subtitle>
                    <v-card-subtitle>
                      <strong>Data de Aceitação:</strong> {{ new Date(consent.terms[0].createdAt).toLocaleString() }}
                    </v-card-subtitle>
                    <v-card-subtitle>
                      <strong>Ativo:</strong> {{ consent.isActive ? 'Sim' : 'Não' }}
                    </v-card-subtitle>
                    <v-divider></v-divider>

                    <v-card-text>
                      <p><strong>Itens do Termo:</strong></p>
                      <v-list>
                        <v-list-item-group>
                          <v-list-item v-for="(item, itemIndex) in consent.terms[0].items" :key="itemIndex">
                            <v-list-item-content>
                              <v-list-item-title>
                                Nome do item: {{ item.name }} 
                                <br>
                                Tag: {{ item.tag }}
                                <span v-if="item.isMandatory"
                                  style="color: red; font-weight: bold;">[Obrigatório]</span>
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                Descricao: {{ item.description }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              <v-card>
                <p>Não há histórico de consentimento para este usuário.</p>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
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
    const router = useRouter();
    const drawer = ref(true);
    const username = ref(localStorage.getItem("username"));
    const userId = ref(localStorage.getItem("userId"));
    const token = ref(localStorage.getItem("authToken"));
    const policies = ref([]);
    const valid = ref(false);
    const activeTab = ref(0);
    const userHistorycal = ref();

    // Função de logout
    const logout = () => {
      localStorage.removeItem("id");
      localStorage.removeItem("username");
      router.push("/login");
    };

    // Navegação entre rotas
    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    // Busca historico de consentimento
    const fetchPolicies = async () => {
      try {
        const response = await grafenoAPI.get(`/acceptance-terms`);
        if (response.data && Array.isArray(response.data)) {
          policies.value = response.data.map((policy) => ({
            id: policy.policyId,
            description: `Descrição para política ${policy.policyId}`,
            isActive: policy.isActive,
            isMandatory: policy.isMandatory,
            acceptanceDate: policy.acceptanceDate,
          }));
          console.log("Políticas de consentimento buscadas:", policies.value);
        } else {
          console.warn("Nenhuma política de consentimento encontrada.");
        }
      } catch (error) {
        console.error("Erro ao buscar políticas:", error);
      }
    };

    // Salva as políticas atualizadas
    const savePolicies = async () => {
      const consentData = {
        userId: userId.value,
        consents: policies.value.map((policy) => ({
          id: policy.id,
          status: policy.isActive,
          isMandatory: policy.isMandatory,
        })),
      };

      try {
        await grafenoAPI.post("/user-consent/update", consentData);
        alert("Permissões atualizadas com sucesso.");
      } catch (error) {
        console.error("Erro ao salvar permissões:", error);
        alert("Erro ao atualizar permissões.");
      }
    };

    const buscaTermoHistoricoDoUser = async () => {
      try {
        const response = await grafenoAPI.get(`/user-consent/${userId.value}`);

        if (response.data !== null) {
          userHistorycal.value = response.data.map(item => ({
            ...item,
            username: item.username || 'Usuário não identificado',
          }));
          console.log("Histórico de Termos de uso vinculados ao user:", userHistorycal.value);
        } else {
          console.warn("Nenhum histórico do Termo de uso encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
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

    onMounted(() => {
      fetchPolicies();
      buscaTermoHistoricoDoUser();
    });

    return {
      drawer,
      username,
      logout,
      valid,
      userId,
      policies,
      activeTab,
      fetchPolicies,
      savePolicies,
      navigateTo,
      userHistorycal,
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