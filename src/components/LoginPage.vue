<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <!-- Coluna Esquerda (Formulário de Login) -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field v-model="email" label="E-mail" :rules="[emailRules]" required></v-text-field>

              <v-text-field v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
                :rules="[passwordRules]" required></v-text-field>

              <v-btn color="primary" @click="login">Login</v-btn>
            </v-form>

            <!-- Link para página de cadastro -->
            <div class="mt-4">
              <span>Não tem uma conta? </span>
              <router-link to="/register" color="primary">Cadastre-se</router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Coluna Direita (Imagem) -->
      <v-col cols="12" md="6">
        <v-img src="/little_pig.jpg" alt="Little Pig" class="right-image" contain></v-img>
      </v-col>
    </v-row>

    <v-dialog v-model="showTermsDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Atualização dos Termos de Uso</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <!-- Loop pelos termos -->
            <v-list-item-group v-for="term in terms" :key="term._id">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ term.version }} - {{ term.description }}</v-list-item-title>
                  <!-- Exibir os itens do termo -->
                  <v-list dense>
                    <v-list-item v-for="item in term.items" :key="item.tag">
                      <v-list-item-content>
                        <v-list-item-title>
                          <span :style="{ fontWeight: item.isMandatory ? 'bold' : 'normal' }">
                            {{ item.name }}
                          </span>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                        <!-- Exibir um destaque para os itens obrigatórios -->
                        <v-chip v-if="item.isMandatory" color="red" text-color="white" small>Obrigatório</v-chip>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- Mensagem de alerta se o termo não foi aceito -->
          <v-alert v-if="isTermOutdated" type="warning" color="yellow">
            Você ainda não aceitou a versão mais recente dos termos de uso. É necessário aceitar para continuar
            utilizando a aplicação.
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="acceptTerms">Aceitar</v-btn>
          <!-- Botão para redirecionar para os termos completos -->
          <v-btn color="secondary" @click="redirectToTermsPage">Ver Termos Completos</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { grafenoAPI } from '@/base_url/baseUrlNode.js';

export default {
  name: "LoginPage",
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      showPassword: false,
      showTermsDialog: false,
      terms: null,
      emailRules: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
      ],
      passwordRules: [
        (v) => !!v || "Senha é obrigatória",
        (v) => v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
      ],
      isTermOutdated: false, // Flag para verificar se os termos estão desatualizados
    };
  },
  mounted() {
    // Chama a função fetchTerms ao montar o componente
    this.fetchTerms();
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        const payload = {
          email: this.email,
          password: this.password,
        };

        try {
          const response = await grafenoAPI.post('/user/login', payload);

          const { user } = response.data;

          // Caso os termos não tenham sido aceitos
          if (user.consentStatus === false) {
            this.showTermsDialog = true;
            return;
          }

          // Se o token não for retornado
          const { token } = response.data;
          if (!token) {
            throw new Error("Token não retornado pelo servidor.");
          }

          // Salvar os dados no localStorage
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('username', user.username);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('consentStatus', user.consentStatus);
          localStorage.setItem("userData", JSON.stringify(response.data.user));

          // Redirecionar para a página inicial
          this.$router.push({ name: 'Home' });

        } catch (error) {
          // Verificar se o erro é relacionado aos termos
          if (error.response?.data?.error === 'TERMS_NOT_ACCEPTED') {
            this.fetchTerms();  // Carrega os termos quando necessário
            this.showTermsDialog = true;
          } else {
            console.error("Erro ao fazer login:", error.response?.data || error.message);
            alert('Erro ao fazer login: ' + (error.response?.data?.message || 'Erro desconhecido'));
          }
        }
      }
    },

    async fetchTerms() {
      try {
        const response = await grafenoAPI.get("/acceptance-terms");
        console.log("Termos carregados:", response.data);

        // Armazena os termos carregados na variável this.terms
        this.terms = response.data;

        // Verificar se os termos estão desatualizados
        const currentTerm = this.terms.find(term => term.isActive);
        if (currentTerm) {
          this.isTermOutdated = !this.hasAcceptedLatestTerm(currentTerm);
        }

      } catch (error) {
        console.error("Erro ao buscar os termos de uso:", error);
        alert("Erro ao carregar os termos de uso.");
      }
    },

    hasAcceptedLatestTerm(currentTerm) {
      const acceptedTerms = JSON.parse(localStorage.getItem('acceptedTerms')) || [];
      return acceptedTerms.some(term => term.version === currentTerm.version);
    },

    async acceptTerms() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error("ID do usuário não encontrado no localStorage.");
        }

        // Verifica se há termos carregados
        if (!this.terms || this.terms.length === 0) {
          throw new Error("Nenhum termo de uso disponível.");
        }

        // Seleciona o termo ativo mais recente
        const currentTerm = this.terms.find(term => term.isActive);
        if (!currentTerm) {
          throw new Error("Nenhum termo ativo encontrado.");
        }

        // Prepara o payload para enviar a atualização dos termos aceitos
        const payload = {
          acceptanceTerms: [currentTerm],
          _id: userId,
        };

        // Envia a requisição para atualizar os termos aceitos
        const response = await grafenoAPI.patch("/user/acceptance-terms", payload);

        if (response.status === 200) {
          // Se o envio for bem-sucedido, informa o usuário e redireciona para o login
          alert("Termos aceitos com sucesso! Faça login novamente.");

          // Salva os termos aceitos no localStorage
          const acceptedTerms = JSON.parse(localStorage.getItem('acceptedTerms')) || [];
          acceptedTerms.push(currentTerm);
          localStorage.setItem('acceptedTerms', JSON.stringify(acceptedTerms));

          // Redireciona para a página de login
          this.showTermsDialog = false;
          this.$router.push({ name: "Login" });
        } else {
          throw new Error("Erro ao salvar o consentimento.");
        }
      } catch (error) {
        console.error("Erro ao aceitar os termos:", error);
        alert("Erro ao aceitar os termos: " + (error.response?.data?.message || "Erro desconhecido"));
      }
    },

    redirectToTermsPage() {
      // Redireciona o usuário para a página dos termos completos
      window.open('https://github.com/quarks-team/Projeto-Integrador-SPCGrafeno/wiki/User-Acceptance-terms', '_blank');
    }
    ,
  },
};
</script>



<style scoped>
.fill-height {
  background-image: url('@/assets/abstract.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.right-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>