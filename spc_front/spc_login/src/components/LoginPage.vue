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
        <v-img
          src="/little_pig.jpg"
          alt="Little Pig"
          class="right-image"
          contain
        ></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginPage",
  data() {
    return {
      valid: false,
      email: "",
      password: "",
      showPassword: false,
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
          const response = await axios.post('http://localhost:3000/user/login', payload);

          const username = response.data.username;
          localStorage.setItem('username', username);

          const id = response.data.id
          localStorage.setItem('id', id);

          this.$router.push({ name: 'Home' });
        } catch (error) {
          console.error("Erro ao fazer login:", error);
          alert('Erro ao fazer login: ' + (error.response?.data?.message || 'Erro desconhecido'));
        }
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
