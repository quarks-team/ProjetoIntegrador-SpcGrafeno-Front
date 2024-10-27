<template>
    <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="navigateTo('home')">
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
            <v-card-title>
              Configurações de Consentimento
            </v-card-title>
            <v-card-subtitle>
              Revise e gerencie as permissões para o uso dos seus dados.
            </v-card-subtitle>
            <v-card-text>
              <v-form v-model="valid">
                <v-list dense>
                  <v-subheader>Nossos Termos e Condições
                  </v-subheader>
  
                  <v-list-item v-for="policy in policies" :key="policy.id">
                    <v-list-item-content>
                      <v-list-item-title>{{ policy.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ policy.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-checkbox
                        v-if="!policy.isMandatory"
                        v-model="policy.isActive"
                        :label="policy.isActive ? 'Aceito' : 'Revogado'"
                      ></v-checkbox>
                      <v-chip
                        v-if="policy.isMandatory"
                        label
                        color="red"
                        class="ml-2"
                      >
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
        </v-col>
      </v-row>
    </v-container>
    </main>
    </v-app>
  </template>
  
  <script>
    import { ref, onMounted } from "vue";
    import axios from "axios";
    import { useRouter } from "vue-router";
  
  export default {
    data() {
        const router = useRouter();
        const username = ref(localStorage.getItem('username'));
        const drawer = ref(true);

        const logout = () => {
            localStorage.removeItem('endorserName');
            localStorage.removeItem('username');
            router.push('/login');
        };

      return {
        drawer,
        username,
        logout,
        valid: false,
        userId: '', 
        policies: []
      };
    },
    mounted() {
      this.fetchPolicies();
    },
    methods: {
      async fetchPolicies() {
        try {
          const response = await axios.get(`http://localhost:3000/user_consent?userId=${this.userId}`);
          this.policies = response.data.map(policy => ({
            id: policy.policyId,
            name: `Política ${policy.policyId}`,
            description: `Descrição para política ${policy.policyId}`,
            isActive: policy.isActive,
            isMandatory: policy.isMandatory,
            acceptanceDate: policy.acceptanceDate
          }));
        } catch (error) {
          console.error('Erro ao buscar políticas:', error);
        }
      },
      async savePolicies() {
        const consentData = {
          userId: this.userId,
          consents: this.policies.map(policy => ({
            id: policy.id,
            status: policy.isActive,
            isMandatory: policy.isMandatory
          }))
        };
  
        try {
          await axios.post('http://localhost:3000/user_consent/update', consentData);
          this.$emit('notify', 'Permissões atualizadas com sucesso');
        } catch (error) {
          console.error('Erro ao salvar permissões:', error);
          this.$emit('notify', 'Erro ao atualizar permissões');
        }
      },
      navigateTo: (page) => {
        if (page === 'contratos') {
          router.push('/contratos');
        } else if (page === 'config') {
          router.push('/config');
        } else if (page === 'home') {
          router.push('/home');
        }
      },
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
  