import { isObject } from 'lodash';
const user = {
  state: {
    info: ''
  },
  mutations: {
    SET_USER: (state, user) => {
      state.info = isObject(user) ? JSON.stringify(user) : user;
    },
  },
  actions: {
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_USER', '');
        resolve();
      });
    },
  }
};

export default user;
