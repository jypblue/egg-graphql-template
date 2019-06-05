export default {
  state: {
    opened: true,
  },
  mutations: {
    'TOGGLE_SIDEBAR'(state, opened) {
      state.opened = !state.opened;
    }
  }
};