<template>
    <div class="duplicata-form">
      <h2>Inserir Parâmetros da Duplicata</h2>
      <form @submit.prevent="calcularProbabilidade" class="form-container">
  
        <!-- Endossante -->
        <div class="form-group">
          <label for="endossante">Endossante:</label>
          <input type="text" v-model="form.endossante" class="form-control" required />
        </div>

        <!-- Área de Atuação -->
        <div class="form-group">
            <label for="areaAtuacao">Área de Atuação:</label>
            <select v-model="form.areaAtuacao" class="form-control" required>
                <option v-for="area in areasDeAtuacao" :key="area" :value="area">{{ area }}</option>
            </select>
        </div>
  
        <!-- Due Date -->
        <div class="form-group">
          <label for="dueDate">Data de Vencimento:</label>
          <input type="date" v-model="form.dueDate" class="form-control" required />
        </div>
  
        <!-- Payment Place -->
        <div class="form-group">
          <label for="paymentPlace">Local de Pagamento:</label>
          <input type="text" v-model="form.paymentPlace" class="form-control" required />
        </div>
  
        <!-- Created At -->
        <div class="form-group">
          <label for="createdAt">Data de Criação da duplicata:</label>
          <input type="date" v-model="form.createdAt" class="form-control" required />
        </div>
  
        <!-- Kind -->
        <div class="form-group">
          <label for="kind">Tipo de Duplicata:</label>
          <input type="text" v-model="form.kind" class="form-control" required />
        </div>

        <!-- Segmento -->
        <div class="form-group">
            <label for="segmento">Segmento:</label>
            <select v-model="form.segmento" class="form-control" required>
                <option value="produto">Produto</option>
                <option value="servico">Serviço</option>
                <option value="outro">Outro</option> <!-- Adiciona a opção "Outro" -->
            </select>
        </div>

        <!-- Botão Calcular Probabilidade -->
        <button type="submit" class="btn-submit">Calcular Probabilidade</button>
      </form>
      <div class="resultado-probabilidade" v-if="probabilidadeCalculada">
        <p>Probabilidade calculada: {{ probabilidade }}%</p> <!-- Exibe o valor da probabilidade -->
      </div>
    </div>
</template>

<script>

export default {

  data() {
    return {
      form: {
        endossante: '',
        areaAtuacao:'',
        dueDate: '',
        paymentPlace: '',
        createdAt: '',
        kind: '',
        segmento: ''
      },
      areasDeAtuacao: [
        'COMERCIO', 'INDUSTRIA', 'DISTRIBUIDORA', 'PRODUTOS', 'PLASTICOS', 'QUIMICA', 'SERVICOS', 'ALIMENTOS', 
        'METAIS', 'EMBALAGENS', 'TEXTIL', 'ELETRONICO', 'ELETRICOS', 'AGRICOLAS', 'MEDICAMENTOS', 'FRIGORIFICO', 
        'PECAS', 'LOGISTICA', 'COMPONENTES', 'AGROPECUARIA', 'TRADING', 'BEBIDAS', 'SUPRIMENTOS', 'TRANSPORTE', 
        'SIDERURGICOS', 'FARMACIA', 'DIAGNOSTICOS', 'CONSTRUCOES', 'CONSULTORIA', 'FINANCEIRA', 'ARGAMASSA', 
        'FABRICAN', 'PETROLEO', 'TERMOPLASTICOS', 'METALURGICOS', 'SUPLEMENTOS', 'FUNDICAO', 'VEICULOS', 'EQUIPAMENTOS'
      ],
      probabilidade: 0, // Adiciona a propriedade para armazenar a probabilidade
      probabilidadeCalculada: false, // Estado para controlar a exibição do resultado
    };
  },
  methods: {
    calcularProbabilidade() {
      // Lógica para calcular a probabilidade
      this.probabilidade = Math.random() * 100; // Gera um valor aleatório para a probabilidade
      this.probabilidadeCalculada = true; // Atualiza o estado para mostrar o resultado
      alert('Probabilidade calculada com sucesso!');
    }
  }
};
</script>

<style scoped>
.duplicata-form {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}
.form-group {
    margin-bottom: 1em;
}
.form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
}
.form-control:focus {
    border-color: #007bff;
    outline: none;
}
.btn-submit {
    background-color: #007bff;
    color: white;
    padding: 0.5em 1em;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.btn-submit:hover {
    background-color: #0056b3;
}
.chart-container {
    margin-top: 20px;
}
.resultado-probabilidade {
    margin-top: 20px;
    font-weight: bold;
}
</style>
