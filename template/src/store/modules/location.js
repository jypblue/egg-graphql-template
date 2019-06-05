import { censor } from '@/utils/tool';
const location = {
  state: {
    url: ''
  },
  mutations: {
    SET_URL: (state, URL) => {
      state.url = JSON.stringify(URL, censor(URL));
    },
  },
  actions: {
  }
};

export default location;
