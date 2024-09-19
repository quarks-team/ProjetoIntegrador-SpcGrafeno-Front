<template>
    <v-container class="fill-height background-image" fluid>
      <v-row 
      class="d-flex justify-center align-center"
      style="min-height: 100vh;"
      >
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              <span class="headline">Cadastro</span>
            </v-card-title>
            <v-card-text>
              <v-form v-model="valid" ref="form" lazy-validation>
                <!-- Nome -->
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Nome"
                  required
                ></v-text-field>
  
                <!-- E-mail -->
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
  
                <!-- Senha -->
                <v-text-field
                  v-model="password"
                  :rules="passwordRules"
                  label="Senha"
                  type="password"
                  required
                ></v-text-field>
  
                <!-- Botão de envio -->
                <v-btn :disabled="!valid" color="primary" @click="submit">
                  Enviar
                </v-btn>
              </v-form>
              <!-- Link para Login -->
               <span>Já tem uma conta? </span>
              <router-link to="/login">Faça login</router-link>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "RegisterPage",
    data() {
      return {
        valid: false,
        name: "",
        email: "",
        password: "",
        // Validações para os campos
        nameRules: [(v) => !!v || "Nome é obrigatório"],
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
      submit() {
        if (this.$refs.form.validate()) {
          alert("Formulário enviado!");
          // Lógica de envio do formulário aqui
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
  </style>
  
  