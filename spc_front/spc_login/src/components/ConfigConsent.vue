<template>
    <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="goHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>Bem vindo {{ username || 'Usuário' }}</v-list-item-title>
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

    <main>
      <v-container fluid class="background-image">
        <v-row justify="center" align="center" class="min-height">
          <v-col cols="12" md="6" class="text-center">
            <v-card class="mx-auto" flat>
            <v-card-title>Gerenciamento de Consentimento</v-card-title>
  
        <!-- Feedback visual para ações do usuário -->
        <v-alert v-if="feedbackMessage" :type="feedbackType" dismissible>
          {{ feedbackMessage }}
        </v-alert>
  
        <!-- Listagem das políticas de consentimento -->
        <v-list two-line>
          <v-list-item-group>
            <v-list-item v-for="(policy, index) in policies" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ policy.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ policy.description }}</v-list-item-subtitle>
              </v-list-item-content>
              
              <!-- Switches de consentimento -->
              <v-list-item-action v-if="!policy.isMandatory">
                <v-switch
                  v-model="policy.accepted"
                  @change="updateConsent(policy)"
                  :label="policy.accepted ? 'Aceito' : 'Rejeitado'"
                ></v-switch>
              </v-list-item-action>
  
              <!-- Políticas obrigatórias (fixas) -->
              <v-list-item-action v-else>
                <v-chip color="green" label>Obrigatório</v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
  
        <!-- Botão para salvar mudanças -->
        <v-card-actions>
          <v-btn color="primary" @click="saveChanges">Salvar Alterações</v-btn>
        </v-card-actions>
      </v-card>
      </v-col>
      </v-row>
  
      <!-- Informações detalhadas de impacto -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title class="headline">{{ selectedPolicy.title }}</v-card-title>
          <v-card-text>
            {{ selectedPolicy.impact }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="dialog = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    </main>
   </v-app>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import axios from "axios";
  import { ref, onMounted } from "vue";

  export default {
    setup() {
      const id = ref(localStorage.getItem('id'));
      const router = useRouter();
      const username = ref(localStorage.getItem('username' || 'Usuário'));
      const policies = ref([]);
      const dialog = ref(false);
      const selectedPolicy = ref({});
      const feedbackMessage = ref('');
      const feedbackType = ref('');

      const fetchPolicies = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user_policy/${id.value}`);
        policies.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar políticas:", error);
      }
    };

    onMounted(() => {
      if (cnpj.value) {
        fetchPolicies();
      }
    });

    const updateConsent = (policy) => {
      if (!policy.accepted) {
        showImpact(policy);
      }
    };

    const showImpact = (policy) => {
      selectedPolicy.value = policy;
      dialog.value = true;
    };

    const saveChanges = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/consent/update`, {
          cnpj: cnpj.value,
          policies: policies.value
        });
        feedbackMessage.value = 'Consentimentos atualizados com sucesso.';
        feedbackType.value = 'success';
      } catch (error) {
        feedbackMessage.value = 'Erro ao atualizar consentimentos.';
        feedbackType.value = 'error';
        console.error("Erro ao salvar alterações:", error);
      }
    };

      const logout = () => {
      localStorage.removeItem('cnpj');
      localStorage.removeItem('username');
      router.push('/login');
    };

      return {
        drawer: ref(true),
        logout,
        cnpj,
        username,
        dialog,
        feedbackMessage,
        feedbackType,
        selectedPolicy,
        policies,
        updateConsent,
        saveChanges,
        showImpact
      };
    },
    methods: {
      navigateTo: (page) => {
        if (page === 'contratos') {
          router.push('/contratos');
        } else if (page === 'config') {
          router.push('/config');
        }
      },
    }
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
  