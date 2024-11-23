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
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                @click:append="showPassword = !showPassword"
                :rules="[passwordRules]" 
                required
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
          <p>{{ termsDescription }}</p>
          <v-list>
            <v-list-item v-for="(term, index) in terms" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ term.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ term.description }} - 
                  <strong>{{ term.isMandatory ? 'Obrigatório' : 'Opcional' }}</strong>
                </v-list-item-subtitle>
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
      showTermsDialog: false, // Controle do diálogo
      terms: [], // Lista de termos recuperados do backend
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

          const { token, user } = response.data;

          if (token) {
            // Salvar o token no localStorage
            localStorage.setItem('authToken', response.data.token);

            // Salvar detalhes do usuário no localStorage
            localStorage.setItem('username', user.username);
            localStorage.setItem('userId', user._id);
            localStorage.setItem('consentStatus', user.consentStatus);
            localStorage.setItem("userData", JSON.stringify(response.data.user));

            // Verificar se o usuário aceitou os termos
            if (!user.consentStatus) {
              await this.loadTerms(); // Carregar termos do backend
              this.showTermsDialog = true; // Mostrar diálogo de aceite
            } else {
              this.$router.push({ name: 'Home' });
            }
          } else {
            throw new Error("Token não retornado pelo servidor.");
          }
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          alert('Erro ao fazer login: ' + (error.response?.data?.message || 'Erro desconhecido'));
        }
      }
    },
    async loadTerms() {
      try {
        const response = await grafenoAPI.get('/acceptance-terms');
        const termsData = response.data;

        // Mapear os itens dos termos para exibição
        this.terms = termsData.items.map(item => ({
          name: item.name,
          description: item.description,
          isMandatory: item.isMandatory,
          tag: item.tag,
        }));
      } catch (error) {
        console.error("Erro ao carregar termos:", error);
        alert("Erro ao carregar os termos. Tente novamente.");
      }
    },
    async acceptTerms() {
      try {
        const userId = localStorage.getItem("userId");
        const payload = {
          userId,
          consents: this.terms.map(term => ({
            id: term.id,
            status: true,
            isMandatory: term.isMandatory,
          })),
        };

        await grafenoAPI.post('/user', payload);

        // Atualiza o consentStatus no localStorage
        localStorage.setItem('consentStatus', true);

        // Fecha o diálogo e redireciona o usuário
        this.showTermsDialog = false;
        this.$router.push({ name: 'Home' });
      } catch (error) {
        console.error("Erro ao aceitar os termos:", error);
        alert("Erro ao aceitar os termos. Tente novamente.");
      }
    },
  },
};
</script>

<style scoped>
.v-container.background-image {
  background-image: url('@/assets/abstract.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}
.v-card {
  background-color: rgba(255, 255, 255, 0.8);
}
.ml-1 {
  margin-left: 6px;
}
.pergunta{
  margin-left: 10px;
}
.headline{
  margin-left: 20px;
}
</style>


  