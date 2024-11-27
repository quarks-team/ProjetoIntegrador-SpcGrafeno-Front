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
        <div v-if="userTerm && userTerm.acceptanceTerms && userTerm.acceptanceTerms.length > 0">
          <v-card class="mx-auto" id="cardTermoAtual" flat>
            <!-- Exibindo informações do termo -->
            <v-card-title class="text-center">
              {{ userTerm.consentStatus ? 'Consentimento Aceito' : 'Consentimento Não Aceito' }}
            </v-card-title>
            <v-card-subtitle class="text-center display-3">
              Termo: {{ userTerm.acceptanceTerms[0][0].description }}
              <br><br>
              Aceito pelo usuario: {{ userTerm.username }}
            </v-card-subtitle>
            <v-divider></v-divider>

            <v-card-text>
              <p><strong>Versão:</strong> {{ userTerm.acceptanceTerms[0][0].version }}</p>
              <p><strong>Data do Consentimento:</strong> {{ new Date(userTerm.consentDate).toLocaleString() }}</p>
            </v-card-text>

            <v-card-text>
              <p><strong>Itens do Termo:</strong></p>

              <!-- Itens obrigatórios -->
              <v-list>
                <v-list-item-group
                  v-if="userTerm.acceptanceTerms[0][0].items && userTerm.acceptanceTerms[0][0].items.length">
                  <v-list-item
                    v-for="(item, index) in userTerm.acceptanceTerms[0][0].items.filter(item => item.isMandatory)"
                    :key="index">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }} ({{ item.tag }})
                        <span v-if="userTerm.acceptanceTerms[0][0].restrictions.includes(item.tag)"
                          style="color: red; font-weight: bold;">
                          [Rejeitado]
                        </span>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Obrigatório</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>

              <!-- Divisão entre obrigatórios e não obrigatórios -->
              <v-divider></v-divider>

              <!-- Itens não obrigatórios -->
              <v-list>
                <v-list-item-group
                  v-if="userTerm.acceptanceTerms[0][0].items && userTerm.acceptanceTerms[0][0].items.length">
                  <v-list-item
                    v-for="(item, index) in userTerm.acceptanceTerms[0][0].items.filter(item => !item.isMandatory)"
                    :key="index">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }} ({{ item.tag }})
                        <span v-if="userTerm.acceptanceTerms[0][0].restrictions.includes(item.tag)"
                          style="color: red; font-weight: bold;">
                          [Rejeitado]
                        </span>
                      </v-list-item-title>
                      <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                      <v-list-item-subtitle>Não Obrigatório</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>

            <!-- Exibindo as restrições -->
            <v-card-text>
              <p><strong>Restrições:</strong></p>
              <v-list>
                <v-list-item-group
                  v-if="userTerm.acceptanceTerms[0][0].restrictions && userTerm.acceptanceTerms[0][0].restrictions.length">
                  <v-list-item v-for="(restriction, index) in userTerm.acceptanceTerms[0][0].restrictions" :key="index">
                    <v-list-item-content>
                      <v-list-item-title>{{ restriction }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Botão para exportar para PDF com estilo e alinhamento ajustado -->
          <div class="text-center mt-4">
            <v-btn color="primary" @click="exportTermoAtualToPDF">Exportar termo para PDF</v-btn>
          </div>
        </div>

        <!-- Caso userTerm esteja indefinido ou não tenha termos de aceitação -->
        <div v-else>
          <v-card>
            <p>Carregando informações do termo...</p>
          </v-card>
        </div>
      </v-container>

      <v-container fluid>
        <v-card>
          <v-card-title>Histórico de Consentimento</v-card-title>
          <v-card-text>
            <p>Exiba aqui o histórico completo de consentimentos do usuário.</p>
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
    const userTerm = ref();

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
        const response = await grafenoAPI.get(`/user-consent/${userId.value}`);
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

    const buscaTermoDoUser = async () => {
      try {
        const response = await grafenoAPI.get(`/user/id/${userId.value}`);

        if (response.data !== null) {
          userTerm.value = response.data;
          console.log("Termo de uso vinculado ao user:", userTerm.value);
        } else {
          console.warn("Nenhuma Termo de uso encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar Termo:", error);
      }
    };

    const exportTermoAtualToPDF = () => {
      const element = document.querySelector('#cardTermoAtual'); // Seleciona a parte que será exportada
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
      buscaTermoDoUser();
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
      userTerm,
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