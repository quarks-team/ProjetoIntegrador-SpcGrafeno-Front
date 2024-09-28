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
                    @change="handleConsentChange"
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

              <!-- Botão de envio do formulário -->
              <v-btn color="primary" :disabled="!valid" @click="submit">
                Enviar
              </v-btn>
            </v-form>

            <!-- Link para login -->
             <span>Já tem uma conta? </span>
            <router-link to="/login">Faça login</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pop-up de consentimento -->
    <v-dialog v-model="showConsentPopup" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Gerenciamento de Consentimento</span>
        </v-card-title>

        <v-card-text>
          <p>
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o
            direito de revogar ou alterar seu consentimento sobre o uso de seus
            dados pessoais.
          </p>

          <!-- Checkbox para consentimento -->
      <v-checkbox
        v-model="consentStatus"
        label="Aceito o uso dos meus dados pessoais de acordo com os Termos e Condições"
        @change="handleConsentChange"
      ></v-checkbox>

          <!-- Aviso de revogação completa -->
          <v-alert v-if="consentStatus === 'none'" type="warning" outlined>
            Caso não aceite os Termos e Condições e a Política de Privacidade, seus dados não serão salvos
            em nossa base de dados e você não perderá acessar a plataforma.
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="blue darken-1" @click="closePopup">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveConsent">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      phonenumber: "",
      termsAccepted: false, // Para verificar se os termos foram aceitos
      showConsentPopup: false, // Controla o pop-up de consentimento
      consentStatus: false,
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
      termsRules: [(v) => !!v || "Você deve aceitar os termos e condições"],
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate() && this.termsAccepted) {
        const payload = {
          username: this.name,
          email: this.email,
          password: this.password,
          phoneNumber: this.phonenumber,
          companyId: this.companyId,
          consentStatus: this.consentStatus,
          consentDate: new Date(),
        };

        try {
          await axios.post('http://localhost:3000/user', payload);
          alert('Usuário criado com sucesso!');
          this.$router.push({name: 'LoginPage'});
        } catch (error) {
          alert('Erro ao criar o usuário: ' + error.response.data.message);
        }
      }
    },
    // Exibe o pop-up de consentimento quando o checkbox de termos é marcado
    handleConsentChange() {
      if (this.termsAccepted) {
        this.showConsentPopup = true;
      }
    },
    saveConsent() {
      // Lógica para salvar o status de consentimento
      console.log("Status de consentimento salvo:", this.consentStatus);
      this.showConsentPopup = false;
    },
    closePopup() {
      // Fecha o pop-up sem salvar e desmarca o checkbox
      this.showConsentPopup = false;
      this.termsAccepted = false; // Desmarca o checkbox se o pop-up for cancelado
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
  background-color: rgba(255, 255, 255, 0.8); /* Transparência para o card */
}

.terms-link,
.privacy-link {
  color: #3f51b5;
  text-decoration: underline;
}
</style>

  