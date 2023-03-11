import { createStore } from "vuex";

export default createStore({
  state: {
    isLoggedIn: false,
    fullName: "",
  },
  mutations: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});
