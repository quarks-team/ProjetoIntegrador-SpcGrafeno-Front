<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" permanent class="drawer-background">
      <v-list>
        <v-list-item>
          <v-btn icon @click="navigateTo('home')">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-list-item-content>
            <v-list-item-title>Bem-vindo {{ username || 'Usuário' }}</v-list-item-title>
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

        <v-list-item link @click="navigateTo('data-previsao')" class="drawer-text">
          <v-list-item-action>
            <v-icon color="white">mdi-cached</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>HISTÓRICO DE DUPLICATAS</v-list-item-title>
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
                        <v-list-item-title>Política{{ policy.id }}</v-list-item-title>
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
          </v-col>
        </v-row>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { grafenoAPI } from "@/base_url/baseUrlNode";

export default {
  data() {
    const router = useRouter();
    const drawer = ref(true);
    const username = ref(localStorage.getItem('username'));
    const userId = ref(localStorage.getItem('id'));
    const policies = ref([]);
    const valid = ref(false);

    const logout = () => {
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      router.push('/login');
    };

    const navigateTo = (page) => {
      router.push(`/${page}`);
    };

    const fetchPolicies = async () => {
      try {
        const response = grafenoAPI.get(`/user-consent/${userId.value}`);
        if (response.data && Array.isArray(response.data)) {
          policies.value = response.data.map(policy => ({
            id: policy.policyId,
            description: `Descrição para política ${policy.policyId}`,
            isActive: policy.isActive,
            isMandatory: policy.isMandatory,
            acceptanceDate: policy.acceptanceDate
          }));
          console.log("Políticas de consentimento buscadas:", policies.value);
        } else {
          console.warn("Nenhuma política de consentimento encontrada.");
        }
      } catch (error) {
        console.error('Erro ao buscar políticas:', error);
      }
    };


    const savePolicies = async () => {
      const consentData = {
        userId: userId.value,
        consents: policies.value.map(policy => ({
          id: policy.id,
          status: policy.isActive,
          isMandatory: policy.isMandatory
        }))
      };

      try {
        await grafenoAPI.post('/user-consent/update', consentData);
        alert('Permissões atualizadas com sucesso');
      } catch (error) {
        console.error('Erro ao salvar permissões:', error);
        alert('Erro ao atualizar permissões');
      }
    };

    onMounted(() => {
      fetchPolicies();
    });

    return {
      drawer,
      username,
      logout,
      valid,
      userId,
      policies,
      fetchPolicies,
      savePolicies,
      navigateTo
    };
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