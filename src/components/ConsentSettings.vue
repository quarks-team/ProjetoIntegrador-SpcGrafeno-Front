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
            <v-card-title>Configurações de Consentimento</v-card-title>
            <v-card-text>
              <v-alert type="info" v-if="!acceptanceTerms.length">
                Carregando termos de consentimento...
              </v-alert>

              <div v-else>
                <v-list>
                  <v-list-item-group v-model="selectedTermIndex">
                    <v-list-item
                      v-for="term in acceptanceTerms"
                      :key="term._id"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          Termo versão {{ term.version }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ term.description }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-checkbox
                          v-model="term.isAccepted"
                          @change="updateConsent(term._id, $event)"
                          :disabled="term.isMandatory"
                          :label="term.isMandatory ? 'Obrigatório' : ''"
                        ></v-checkbox>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="saveConsent">Salvar Alterações</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    </main>
    </v-app>
  </template>
  
  <script>
    import { grafenoAPI } from "@/base_url/baseUrlNode.js";
    import { useRouter } from "vue-router";
    import { ref } from "vue";

    export default {
      name: "ConsentSettings",
      data() {
        return {
          acceptanceTerms: [], // Armazena os termos de consentimento
          userData: {}, // Armazena os dados do usuário logado
        };
      },
      setup() {

        const drawer = ref(true);
        const router = useRouter();
        const username = ref(localStorage.getItem('username'));

        const logout = () => {
          localStorage.clear();
          router.push("/login");
        };

        const navigateTo = (page) => {
          router.push(`/${page}`);
        };

        return {
          drawer,
          username,
          logout,
          navigateTo,
        };
      },
      methods: {
        async fetchAcceptanceTerms() {
          try {
            const response = await grafenoAPI.get("/acceptance-terms", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
            console.log("API Response:", response.data);
            this.acceptanceTerms = response.data.terms || [];
          } catch (error) {
            console.error("Erro ao carregar termos de consentimento:", error);
            alert("Erro ao carregar os termos de consentimento.");
          }
        },
        async updateConsent(termId, status) {
          const term = this.acceptanceTerms.find((t) => t._id === termId);
          if (term) term.isAccepted = status;
        },
        async saveConsent() {
          try {
            const token = localStorage.getItem("authToken");
            const acceptanceTerms = this.acceptanceTerms.map((term) => ({
              _id: term._id,
              version: term.version,
              isActive: term.isAccepted,
              description: term.description,
              items: term.items,
              createdAt: term.createdAt,
              restrictions: term.restrictions,
            }));

            const payload = { acceptanceTerms };

            await grafenoAPI.patch("/user/acceptance-terms", payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            alert("Consentimento atualizado com sucesso!");
          } catch (error) {
            console.error("Erro ao salvar consentimento:", error);
            alert("Erro ao salvar o consentimento.");
          }
        },
        loadUserData() {
          try {
            const storedUser = JSON.parse(localStorage.getItem("userData"));
            if (storedUser) {
              this.userData = storedUser;
              this.acceptanceTerms = storedUser.acceptanceTerms || [];
            }
          } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
          }
        },
      },
      created() {
        this.loadUserData();
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
  .spc-score {
  display: flex;
  align-items: center;
  }
  .spc-score .icon {
    margin-right: 4px;
    font-size: 35px;
  }
  </style>
  