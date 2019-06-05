import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import config from '@/config';
import * as modules from './modules';
import getters from './getters';
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ key: config.appKey })],
  modules,
  getters,
});
