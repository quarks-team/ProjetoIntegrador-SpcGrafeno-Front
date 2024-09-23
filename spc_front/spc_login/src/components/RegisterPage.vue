<template>
  <v-container class="fill-height background-image" fluid>
    <v-row class="d-flex justify-center align-center" style="min-height: 100vh;">
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

              <!-- Telefone -->
              <v-text-field
                v-model="phonenumber"
                :rules="phonenumberRules"
                label="Telefone"
                required
              ></v-text-field>

              <!-- Aceitação dos Termos e Condições -->
              <v-row align="center" class="mb-4">
                <v-col cols="auto">
                  <v-checkbox
                    v-model="termsAccepted"
                    :rules="termsRules"
                    required
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <span>Eu aceito os 
                    <router-link to="/termos" class="terms-link" target="_blank">
                      termos e condições
                    </router-link>
                    e consinto com o uso dos meus dados conforme a 
                    <router-link to="/politica-privacidade" class="privacy-link" target="_blank">
                      política de privacidade
                    </router-link>.
                  </span>
                </v-col>
              </v-row>

              <!-- Solicitação de consentimento para uso de dados pessoais -->
              <v-row align="center" class="mb-4">
                <v-col cols="auto">
                  <v-checkbox
                    v-model="dataConsent"
                    :rules="dataConsentRules"
                    required
                  ></v-checkbox>
                </v-col>
                <v-col>
                  <span>Concordo com o uso dos meus dados pessoais para o propósito descrito.</span>
                </v-col>
              </v-row>

              <!-- Botão de envio -->
              <v-btn :disabled="!valid || !termsAccepted || !dataConsent" color="primary" @click="submit">
                Enviar
              </v-btn>
            </v-form>
            <!-- Link para Login -->
            <router-link to="/login">Já tem uma conta? Faça login</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "RegisterPage",
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      phonenumber: "", // Novo campo de número de telefone
      termsAccepted: false, // Para verificar se os termos foram aceitos
      dataConsent: false, // Consentimento para uso de dados pessoais
      companyId: 1, // Exemplo de um ID de empresa fixo
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
      phonenumberRules: [
        (v) => !!v || "Número de telefone é obrigatório",
        (v) => /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/.test(v) || "Telefone deve ser válido",
      ],
      // Validação dos termos
      termsRules: [(v) => !!v || "Você deve aceitar os termos e condições"],
      // Validação do consentimento para uso de dados pessoais
      dataConsentRules: [(v) => !!v || "Você deve consentir com o uso de dados pessoais"],
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate() && this.termsAccepted && this.dataConsent) {
        const payload = {
          username: this.name,
          email: this.email,
          password: this.password,
          phoneNumber: this.phonenumber,
          companyId: this.companyId,
        };

        try {
          await axios.post('http://localhost:3000/register', payload);
          alert('Usuário criado com sucesso!');
        } catch (error) {
          alert('Erro ao criar o usuário: ' + error.response.data.message);
        }
      }
    },
  },
};
</script>

<style scoped>
.v-container.background-image {
  background-image: url('@/assets/background.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.v-card {
  background-color: rgba(255, 255, 255, 0.8); /* Transparência para o card */
}

.terms-link,
.privacy-link {
  color: #3f51b5; /* Personalize a cor do link */
  text-decoration: underline;
}
</style>

  