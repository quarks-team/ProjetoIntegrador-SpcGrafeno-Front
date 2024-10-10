import { shallowMount, createLocalVue } from '@vue/test-utils';
import HomePage from '@/components/HomePage.vue';
import Vuetify from 'vuetify';

// Mocks
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      score: [
        {
          score: 8000,
          active: 10,
          finished: 5,
          canceled: 2,
        }
      ]
    }
  }))
}));

describe('HomePage.vue', () => {
  let wrapper;
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify();
    localStorage.setItem('cnpj', '12345678901234');
    localStorage.setItem('username', 'Test User');

    wrapper = shallowMount(HomePage, {
      vuetify,
    });
  });

  it('renders the username from localStorage', () => {
    const usernameElement = wrapper.find('v-list-item-title');
    expect(usernameElement.text()).toContain('Test User');
  });

  it('fetches score and calculates scorePercentage correctly', async () => {
    // Aguarda a montagem completa e chamada da função de fetch
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.score).toBe(8000);
    expect(wrapper.vm.scoreText).toBe('alto');
    expect(wrapper.vm.scorePercentage).toBe(80);
  });

  it('renders the score and progress correctly', async () => {
    await wrapper.vm.$nextTick();
    
    const scoreText = wrapper.find('.v-card-title').text();
    const scoreValue = wrapper.find('.v-card-subtitle').text();

    expect(scoreText).toContain('Seu Score está alto');
    expect(scoreValue).toContain('8000 de 10000');
  });

  it('handles the logout correctly', async () => {
    wrapper.vm.logout();
    expect(localStorage.getItem('cnpj')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  afterEach(() => {
    wrapper.destroy();
  });
});
