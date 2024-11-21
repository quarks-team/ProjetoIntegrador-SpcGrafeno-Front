<template>
  <v-container class="fill-height background-image" fluid>
    <v-row class="d-flex justify-center align-center" style="min-height: 100vh;">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="headline">Cadastrar novo usuário</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="isFormValid">
              <v-text-field
                v-model="name"
                label="Nome"
                required
                :rules="[v => !!v || 'O nome é obrigatório']"
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                required
                :rules="[v => !!v || 'O email é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail inválido']"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                required
                :rules="[v => !!v || 'A senha é obrigatória', v => v.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Confirme a Senha"
                type="password"
                required
                :rules="[v => v === password || 'As senhas não coincidem']"
              ></v-text-field>

              <v-text-field
                v-model="document"
                label="CNPJ (opcional)"
                :rules="[v => !v || /^[0-9]{14}$/.test(v) || 'CNPJ inválido']"
              ></v-text-field>

              <v-checkbox
                v-model="termsAccepted"
                :disabled="!acceptanceTerms"
                label="Aceito os Termos e Condições"
                :required
              ></v-checkbox>

              <p v-if="acceptanceTerms">
                <strong>Versão {{ acceptanceTerms.version }}</strong>: {{ acceptanceTerms.description }}
              </p>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" :disabled="!isFormValid || !termsAccepted" @click="submit">
              Registrar
            </v-btn>
          </v-card-actions>
            <p class="pergunta">
              Já tem cadastro?
            <router-link to="/login" class="ml-1">Faça login</router-link>.
            </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import { grafenoAPI } from '@/base_url/baseUrlNode';

export default {
  name: "RegisterPage",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      document: "",
      termsAccepted: false,
      isFormValid: false,
      acceptanceTerms: null, // Para armazenar o termo ativo
    };
  },

  methods: {
    async fetchAcceptanceTerms() {
      try {
        const response = await grafenoAPI.get("/acceptance-terms");
        this.acceptanceTerms = response.data;
      } catch (error) {
        console.error("Erro ao buscar termos de aceite:", error);
        alert("Não foi possível carregar os termos de aceite. Tente novamente mais tarde.");
      }
    },
    async submit() {
      if (this.$refs.form.validate() && this.termsAccepted && this.acceptanceTerms) {
        try {
          const payload = {
            username: this.name,
            email: this.email,
            password: this.password,
            cnpj: this.document || null,
            consentStatus: this.termsAccepted,
            consentDate: new Date().toISOString(),
            acceptanceTerms: this.acceptanceTerms, // Vinculando o termo ativo
          };

          const response = await grafenoAPI.post("/user", payload);

          const { token } = response.data;

          if (token) {
            localStorage.setItem("authToken", token);
            alert("Cadastro realizado com sucesso!");
            this.$router.push({ name: "/login" });
          } else {
            throw new Error("Token não retornado pelo servidor.");
          }
        } catch (error) {
          alert("Erro ao criar o usuário: " + (error.response?.data?.message || error.message));
        }
      } else {
        alert("Preencha todos os campos corretamente e aceite os termos.");
      }
    },
  },
  created() {
    this.fetchAcceptanceTerms(); // Buscar o termo ativo ao carregar a página
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


  