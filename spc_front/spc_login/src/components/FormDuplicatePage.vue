<template>
  <div class="duplicata-page d-flex">
    <!-- Formulário da Duplicata -->
    <div class="duplicata-form">
      <h2 class="text-center mb-4">Insira os dados da Duplicata</h2>
      <form @submit.prevent="calcularProbabilidade" class="p-4 border rounded shadow-sm bg-white">
        <div class="form-row">
          <!-- Segmento -->
          <div class="form-group col-md-6">
            <label for="segmento" class="form-label">Segmento:</label>
            <select v-model="form.segment" class="form-control" required>
              <option value="" disabled selected>Selecione um segmento</option>
              <option value="goods">Produtos</option>
              <option value="services">Serviços</option>
            </select>
          </div>
        </div>

        <!-- Área de Atuação -->
        <div class="form-group">
          <label for="areaAtuacao" class="form-label">Área de Atuação:</label>
          <multiselect
            v-model="form.areasDeAtuacao"
            :options="areasDeAtuacao"
            :multiple="true"
            placeholder="Selecione as áreas de atuação"
            label="label"
            track-by="value"
          />
        </div>

        <div class="form-row">
          <!-- Data de Criação -->
          <div class="form-group col-md-6">
            <label for="createdAt" class="form-label">Data de Criação:</label>
            <input type="date" v-model="form.createdDate" class="form-control" required />
          </div>
        </div>

        <div class="form-row">
          <!-- Data de Vencimento -->
          <div class="form-group col-md-6">
            <label for="dueDate" class="form-label">Data de Vencimento:</label>
            <input type="date" v-model="form.dueDate" class="form-control" required />
          </div>

          <!-- Local de Pagamento (select de estados) -->
          <div class="form-group col-md-6">
            <label for="paymentPlace" class="form-label">Local de Pagamento (Estado):</label>
            <select v-model="form.state" class="form-control" required>
              <option value="" disabled selected>Selecione um estado</option>
              <option v-for="estado in estados" :key="estado" :value="estado">{{ estado }}</option>
            </select>
          </div>
        </div>

        <!-- Botão Calcular Probabilidade -->
        <button type="submit" class="btn btn-primary w-100 mt-4">Calcular Probabilidade</button>
      </form>
    </div>

    <!-- Exibir Probabilidade -->
    <div class="probabilidade-card" v-if="probabilidade !== null">
      <h3>Probabilidade de Sucesso</h3>
      <div class="probabilidade-valor" :style="{ color: probabilidadeColor }">{{ probabilidade }}%</div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: probabilidade + '%' }"></div>
      </div>
      <p class="probabilidade-feedback">{{ feedbackProbabilidade }}</p>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";
import axios from "axios";


export default {
  components: { Multiselect },
  data() {
    return {
      form: {
        segmento: "",
        areasDeAtuacao: [],
        paymentPlace: "",
        dueDate: "",
        createdAt: ""
      },
      probabilidade: null,
      result : { 'probability': null},
      areasDeAtuacao: [
        { label: "COMERCIO", value: "COMERCIO" },
        { label: "INDUSTRIA", value: "INDUSTRIA" },
        { label: "DISTRIBUIDORA", value: "DISTRIBUIDORA" },
        { label: "PRODUTOS", value: "PRODUTOS" },
        { label: "PLASTICOS", value: "PLASTICOS" },
        { label: "QUIMICA", value: "QUIMICA" },
        { label: "SERVICOS", value: "SERVICOS" },
        { label: "ALIMENTOS", value: "ALIMENTOS" },
        { label: "METAIS", value: "METAIS" },
        { label: "EMBALAGENS", value: "EMBALAGENS" },
        { label: "TEXTIL", value: "TEXTIL" },
        { label: "ELETRONICO", value: "ELETRONICO" },
        { label: "ELETRICOS", value: "ELETRICOS" },
        { label: "AGRICOLAS", value: "AGRICOLAS" },
        { label: "MEDICAMENTOS", value: "MEDICAMENTOS" },
        { label: "FRIGORIFICO", value: "FRIGORIFICO" },
        { label: "PECAS", value: "PECAS" },
        { label: "LOGISTICA", value: "LOGISTICA" },
        { label: "COMPONENTES", value: "COMPONENTES" },
        { label: "AGROPECUARIA", value: "AGROPECUARIA" },
        { label: "TRADING", value: "TRADING" },
        { label: "BEBIDAS", value: "BEBIDAS" },
        { label: "SUPRIMENTOS", value: "SUPRIMENTOS" },
        { label: "TRANSPORTE", value: "TRANSPORTE" },
        { label: "SIDERURGICOS", value: "SIDERURGICOS" },
        { label: "FARMACIA", value: "FARMACIA" },
        { label: "DIAGNOSTICOS", value: "DIAGNOSTICOS" },
        { label: "CONSTRUCOES", value: "CONSTRUCOES" },
        { label: "CONSULTORIA", value: "CONSULTORIA" },
        { label: "FINANCEIRA", value: "FINANCEIRA" },
        { label: "ARGAMASSA", value: "ARGAMASSA" },
        { label: "FABRICAN", value: "FABRICAN" },
        { label: "PETROLEO", value: "PETROLEO" },
        { label: "TERMOPLASTICOS", value: "TERMOPLASTICOS" },
        { label: "METALURGICOS", value: "METALURGICOS" },
        { label: "SUPLEMENTOS", value: "SUPLEMENTOS" },
        { label: "FUNDICAO", value: "FUNDICAO" },
        { label: "VEICULOS", value: "VEICULOS" },
        { label: "EQUIPAMENTOS", value: "EQUIPAMENTOS" }
]

      ,
      estados: [
        'AL', 'AM', 'AP', 'BA', 'CE', 'ES', 'GO', 'MG', 'MS', 'PA', 'PI', 'PR', 'RJ', 'RS', 'SC', 'SE', 'SP', 'TO'
      ],
    };
  },
  computed: {
    probabilidadeColor() {
      if (this.result >= 0.75) return 'green';
      else if (this.result.probability >= 0.50) return 'orange';
      return 'red';
    },
    feedbackProbabilidade() {
      if (this.result.probability >= 0.75) return 'Alta probabilidade de ser finalizada';
      else if (this.result.probability >= 0.50) return 'Média probabilidade de ser finalizada';
      return 'Baixa probabilidade de ser finalizada';
    },
  },
  methods: {
    
    async calcularProbabilidade() {
      // Calcula o mês e trimestre da data de vencimento
      let dueDate = new Date(this.form.dueDate);
      let month = dueDate.getMonth() + 1;
      let quarter = Math.ceil(month / 3);

      // Envia os dados para a rota no formato esperado
      const payload = {
        segment: this.form.segment,
        month,
        quarter,
        area: this.form.areasDeAtuacao.map(area => area.value),
        date: dueDate.toLocaleDateString('en-GB').toString(),
        created_date: new Date(this.form.createdDate).toLocaleDateString('en-GB').toString(),
        state: this.form.state,
      };
      
      console.log("Payload para a rota:", payload);
      console.log(payload.date);

      
      try {
        const response = await axios.post("http://127.0.0.1:8000/predict-duplicate/", payload);
        this.result = response.data;
      } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
      }
      
      // Mock da probabilidade (valores aleatórios para demonstração)
      this.probabilidade = Math.round(this.result.probability * 100)
    },
  },
};
</script>

<style scoped>
.duplicata-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 20px;
  padding: 20px;
  background: url('@/assets/abstract.jpg');
}

.duplicata-form {
  max-width: 900px;
  margin: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-label {
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 10px;
  margin-right: 10px;
  margin-left: 10px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.probabilidade-card {
  max-width: 300px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  background-color: #fff;
}

.probabilidade-valor {
  font-size: 2.5em;
  font-weight: bold;
  margin: 10px 0;
}

.progress-bar-container {
  width: 100%;
  background-color: #e9ecef;
  border-radius: 8px;
  height: 20px;
  margin: 10px 0;
}

.progress-bar {
  height: 100%;
  border-radius: 8px;
  background-color: #007bff;
  transition: width 0.3s;
}

.form-group {
  margin-bottom: 1.5em;
  margin-left: 20px;
  margin-right: 20px;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background-color: #0056b3;
}
</style>
