<template>
  <div class="duplicata-page d-flex">
    <!-- Formulário da Duplicata -->
    <div class="duplicata-form">
      <h2 class="text-center mb-4">Inserir Parâmetros da Duplicata</h2>
      <form @submit.prevent="calcularProbabilidade" class="p-4 border rounded shadow-sm bg-white">
        <div class="form-row">
          <!-- Segmento -->
          <div class="form-group col-md-6">
            <label for="segmento" class="form-label">Segmento:</label>
            <select v-model="form.segmento" class="form-control" required>
              <option value="" disabled selected>Selecione um segmento</option>
              <option value="produto">Produto</option>
              <option value="servico">Serviço</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <!-- Área de Atuação -->
          <div class="form-group col-md-6">
            <label for="areaAtuacao" class="form-label">Área de Atuação:</label>
            <select v-model="form.areaAtuacao" class="form-control" required>
              <option value="" disabled selected>Selecione uma área</option>
              <option v-for="area in areasDeAtuacao" :key="area" :value="area">{{ area }}</option>
            </select>
          </div>
          <!-- Endossante -->
          <div class="form-group col-md-6">
            <label for="endossante" class="form-label">Endossante (CNPJ ou Nome):</label>
            <input type="text" v-model="form.endossante" class="form-control" />
          </div>
        </div>
        <div class="form-row">
          <!-- Due Date -->
          <div class="form-group col-md-6">
            <label for="dueDate" class="form-label">Data de Vencimento:</label>
            <input type="date" v-model="form.dueDate" class="form-control" required />
          </div>
          <!-- Payment Place -->
          <div class="form-group col-md-6">
            <label for="paymentPlace" class="form-label">Local de Pagamento:</label>
            <input type="text" v-model="form.paymentPlace" class="form-control" />
          </div>
        </div>
        <div class="form-row">
          <!-- Created At -->
          <div class="form-group col-md-6">
            <label for="createdAt" class="form-label">Data de Criação:</label>
            <input type="date" v-model="form.createdAt" class="form-control" />
          </div>
          <!-- Kind -->
          <div class="form-group col-md-6">
            <label for="kind" class="form-label">Tipo de Duplicata:</label>
            <input type="text" v-model="form.kind" class="form-control" />
          </div>
        </div>
        <!-- Botão Calcular Probabilidade -->
        <button type="submit" class="btn btn-primary w-100 mt-4">Calcular Probabilidade</button>
      </form>
    </div>

    <!-- Exibir Probabilidade -->
    <div class="probabilidade-card" v-if="probabilidade !== null">
      <h3>Probabilidade Calculada</h3>
      <div class="probabilidade-valor" :style="{ color: probabilidadeColor }">{{ probabilidade }}%</div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: probabilidade + '%' }"></div>
      </div>
      <p class="probabilidade-feedback">{{ feedbackProbabilidade }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        segmento: '',
        areaAtuacao: '',
        endossante: '',
        dueDate: '',
        paymentPlace: '',
        createdAt: '',
        kind: '',
      },
      probabilidade: null, // Valor da probabilidade calculada
      areasDeAtuacao: [
        'COMERCIO', 'INDUSTRIA', 'DISTRIBUIDORA', 'PRODUTOS', 'PLASTICOS', 'QUIMICA', 'SERVICOS', 'ALIMENTOS', 
        'METAIS', 'EMBALAGENS', 'TEXTIL', 'ELETRONICO', 'ELETRICOS', 'AGRICOLAS', 'MEDICAMENTOS', 'FRIGORIFICO', 
        'PECAS', 'LOGISTICA', 'COMPONENTES', 'AGROPECUARIA', 'TRADING', 'BEBIDAS', 'SUPRIMENTOS', 'TRANSPORTE', 
        'SIDERURGICOS', 'FARMACIA', 'DIAGNOSTICOS', 'CONSTRUCOES', 'CONSULTORIA', 'FINANCEIRA', 'ARGAMASSA', 
        'FABRICAN', 'PETROLEO', 'TERMOPLASTICOS', 'METALURGICOS', 'SUPLEMENTOS', 'FUNDICAO', 'VEICULOS', 'EQUIPAMENTOS'
      ]
    };
  },
  computed: {
    probabilidadeColor() {
      if (this.probabilidade >= 75) return 'green';
      else if (this.probabilidade >= 50) return 'orange';
      return 'red';
    },
    feedbackProbabilidade() {
      if (this.probabilidade >= 75) return 'Alta probabilidade de duplicata';
      else if (this.probabilidade >= 50) return 'Média probabilidade de duplicata';
      return 'Baixa probabilidade de duplicata';
    },
  },
  methods: {
    calcularProbabilidade() {
      // Mock da probabilidade (valores aleatórios para demonstração)
      this.probabilidade = Math.floor(Math.random() * 100) + 1;
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

.form-row {
  margin-left: 20px;
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
