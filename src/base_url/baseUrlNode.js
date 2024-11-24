import axios from 'axios';

// Função para verificar a URL base
const getBaseUrl = async () => {
  try {
    const response = await fetch('http://localhost:3000/alerts');
    return response.ok ? 'http://localhost:3000' : 'https://ip4-recivables-production.up.railway.app';
  } catch (error) {
    return 'https://ip4-recivables-production.up.railway.app';
  }
};

// Criação de uma instância do Axios com uma URL padrão
const grafenoAPI = axios.create({
  baseURL: 'https://ip4-recivables-production.up.railway.app',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Criação de uma instância do Axios com uma URL padrão para o back python
const pythonAPI = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 50000,
});

// Atualiza a baseURL de forma assíncrona
getBaseUrl().then((baseUrl) => {
  grafenoAPI.defaults.baseURL = baseUrl;
});

export { grafenoAPI };
export { pythonAPI };
