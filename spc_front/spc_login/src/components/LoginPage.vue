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
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required]"
                required
              ></v-text-field>
              <v-btn color="primary" @click="submit">Login</v-btn>
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

export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      valid: false,
      rules: {
        required: (value) => !!value || 'Campo obrigatório.',
        email: (value) => /.+@.+\..+/.test(value) || 'E-mail inválido.',
      },
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        /*if (this.email === 'admin@example.com' && this.password === 'password') {
          this.$router.push('/home');
        } else {
          alert('Credenciais inválidas!');
        }*/
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
