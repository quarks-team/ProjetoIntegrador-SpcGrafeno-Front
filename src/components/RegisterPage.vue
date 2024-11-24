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
              <v-text-field v-model="name" :rules="nameRules" label="Nome" required></v-text-field>

              <!-- E-mail -->
              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

              <!-- Senha -->
              <v-text-field v-model="password" :rules="passwordRules" label="Senha" type="password"
                required></v-text-field>

              <v-checkbox v-model="consentStatus" :rules="termsRules"
                label="Eu aceito os termos e condições"></v-checkbox>

              <v-btn :disabled="!consentStatus || !valid" color="primary" @click="submit">
                Cadastrar
              </v-btn>
            </v-form>

            <p class="mt-4">
              Já possui uma conta?
              <a class="login-link" @click.prevent="$router.push({ name: 'Login' })">
                Faça login
              </a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- Pop-up de Consentimento -->
    <v-dialog v-model="showConsentPopup" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Termo de Aceite do Consentimento</span>
        </v-card-title>
        <v-card-text>
          <p>
            De acordo com os nossos termos e política de privacidade. Seus dados
            serão armazenados em nossa base para utilização da nossa aplicação.
            Você poderá alterar as suas preferências posteriormente na guia de configurações.
          </p>

          <!-- Lista de políticas de consentimento -->
          <v-list dense>
            <v-list-item v-for="policy in policies" :key="policy.id">
              <v-list-item-content>
                <v-list-item-title>{{ policy.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ policy.description }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox v-model="policy.status" :disabled="policy.isMandatory"
                  :label="policy.isMandatory ? 'Obrigatório' : 'Aceito'"></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list>
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
import { grafenoAPI } from '@/base_url/baseUrlNode';

export default {
  name: "RegisterPage",
  data() {
    return {
      valid: false,
      name: "",
      email: "",
      password: "",
      consentStatus: false,
      showConsentPopup: false,
      policies: [],
      userId: null,
      // Validation rules
      nameRules: [(v) => !!v || "Nome é obrigatório"],
      emailRules: [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
      ],
      passwordRules: [
        (v) => !!v || "Senha é obrigatória",
        (v) => v.length >= 6 || "A senha deve ter pelo menos 6 caracteres",
      ],
      termsRules: [(v) => !!v || "Você deve aceitar os termos e condições"],
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate() && this.consentStatus) {
        try {
          // Constructing the object to match the required format
          const userData = {
            username: this.name,
            email: this.email,
            password: this.password,
            consentStatus: this.consentStatus,
          };

          // Sending the POST request to create the user
          const response = await grafenoAPI.post('/user', userData);

          console.log("Usuário criado com sucesso:", response.data);

          // Handle response data
          if (response.data && response.data._id) {
            this.userId = response.data._id;
            this.showConsentPopup = true;

            // Optionally log consent details
            console.log("Consent Details:", {
              consentDate: response.data.consentDate,
              acceptanceTerms: response.data.acceptanceTerms,
            });

            await this.fetchPolicies();
          } else {
            throw new Error("ID do usuário não retornado.");
          }
        } catch (error) {
          alert(
            'Erro ao criar o usuário: ' +
            (error.response?.data?.message || error.message)
          );
        }
      }
    },

    async fetchPolicies() {
      if (this.userId) {
        try {
          const response = await grafenoAPI.get(`/user-consent/${this.userId}`);
          console.log("Políticas de consentimento buscadas:", response.data);
          this.policies = response.data.map((policy) => ({
            id: policy.policyId,
            name: `Política ${policy.policyId}`,
            description: `Descrição da política ${policy.policyId}`,
            status: policy.isActive,
            isMandatory: policy.isMandatory,
          }));
        } catch (error) {
          console.error('Erro ao buscar políticas:', error.response?.data?.message || error.message);
        }
      } else {
        console.error("User ID não definido. Não é possível buscar políticas.");
      }
    },

    async saveConsent() {
      const consentData = {
        userId: this.userId,
        consents: this.policies.map((policy) => ({
          id: policy.id,
          status: policy.status,
          isMandatory: policy.isMandatory,
        })),
      };

      try {
        await grafenoAPI.post('/user-consent/update', consentData);
        alert('Consentimento salvo com sucesso!');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Erro ao salvar consentimento:', error);
      }
    },

    closePopup() {
      this.showConsentPopup = false;
      this.consentStatus = false;
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

.terms-link,
.privacy-link {
  color: #3f51b5;
  text-decoration: underline;
}

.login-link {
  color: #3f51b5;
  cursor: pointer;
  text-decoration: underline;
}
</style>