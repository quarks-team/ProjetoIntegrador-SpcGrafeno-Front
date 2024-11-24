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
              <v-text-field 
              v-model="email" 
              label="E-mail" 
              :rules="[emailRules]" 
              required
              ></v-text-field>

              <v-text-field 
              v-model="password" 
              label="Senha" 
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
              :rules="[passwordRules]" required
              ></v-text-field>

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

    <!-- Diálogo de Aceite dos Termos -->
    <v-dialog v-model="showTermsDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Atualização dos Termos de Uso</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="term in terms" :key="term.id">
              <v-list-item-content>
                <v-list-item-title>{{ term.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ term.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="acceptTerms">Aceitar</v-btn>
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
    };
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
              this.terms = response.data;
            } catch (error) {
              console.error("Erro ao buscar os termos de uso:", error);
              alert("Erro ao carregar os termos de uso.");
            }
          },
          async acceptTerms() {
            try {
              const userId = localStorage.getItem('userId');
              if (!userId) {
                throw new Error("ID do usuário não encontrado no localStorage.");
              }
              const consentItem = this.terms.items.find(
                (item) => item.tag === "DATA-USAGE"
              );

              if (!consentItem) {
                throw new Error("Item de consentimento obrigatório não encontrado.");
              }
              const payload = {
                userId: parseInt(userId),
                consents: [
                  {
                    id: consentItem._id,
                    status: true,
                    isMandatory: consentItem.isMandatory,
                  },
                ],
              };

              const response = await grafenoAPI.post("/user", payload);

              if (response.status === 200) {
                alert("Termos aceitos com sucesso!");
                localStorage.setItem("consentStatus", true);
                this.showTermsDialog = false;
                this.$router.push({ name: "Home" });
              } else {
                throw new Error("Erro ao salvar o consentimento.");
              }
            } catch (error) {
              console.error("Erro ao aceitar os termos:", error);
              alert(
                "Erro ao aceitar os termos: " +
                  (error.response?.data?.message || "Erro desconhecido")
              );
            }
          },
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
