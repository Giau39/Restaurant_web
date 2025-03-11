import axios from "axios";
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import * as cookies from "js-cookie";

const state = {
  user: null,
  token: null,
  cart: [],
};

const mutations = {
  setUser(state, user) {
    state.user = user || {}; // Đảm bảo không bị lỗi khi null
  },

  setToken(state, token) {
    state.token = token;
  },

  addToCart(state, item) {
    const itemInCart = state.cart.find((p) => p._id === item._id);
    if (itemInCart) {
      itemInCart.qty++;
    } else {
      state.cart.push({ ...item, qty: 1 });
    }
  },

  setCart(state, data) {
    state.cart = data;
  },

  setUserName(state, name) {
    if (state.user) state.user.name = name;
  },

  setUserEmail(state, email) {
    if (state.user) state.user.email = email;
  },

  setUserImage(state, path) {
    if (state.user) state.user.image = path;
  },
};

const actions = {
  async customerSignup({ commit }, { name, email, password }) {
    try {
      const res = await axios.post("/api/auth/signup", { name, email, password });
      const { token, _doc } = res.data.user;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      commit("setToken", token);
      commit("setUser", _doc);
    } catch (err) {
      throw err.response?.data?.errors?.email || "Signup failed.";
    }
  },

  async customerLogin({ commit }, { email, password }) {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.status === 200) {
        const { token, _doc } = res.data.user;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        commit("setToken", token);
        commit("setUser", _doc);
      }
    } catch (err) {
      const error = err.response?.data?.errors;
      throw error?.email || error?.password || "Login failed.";
    }
  },

  async AdminLogin({ commit }, { email, password }) {
    try {
      const res = await axios.post("/api/auth/dashboard/login", { email, password });
      if (res.status === 200) {
        const { token, _doc } = res.data.user;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        commit("setToken", token);
        commit("setUser", _doc);
      }
    } catch (err) {
      const error = err.response?.data?.errors;
      throw error?.email || error?.password || "Login failed.";
    }
  },

  Logout({ commit }) {
    commit("setToken", null);
    commit("setUser", null);
    delete axios.defaults.headers.common["Authorization"];
  },

  async addToCart({ commit }, { id }) {
    try {
      const res = await axios.get(`/api/dishes/${id}`);
      commit("addToCart", res.data.dish);
    } catch (err) {
      console.error("Error fetching product:", err);
    }
  },

  emptyCart({ commit }) {
    commit("setCart", []);
  },

  updateUser({ commit }, { user }) {
    commit("setUser", user);
  },

  updateName({ commit }, { name }) {
    commit("setUserName", name);
  },

  updateEmail({ commit }, { email }) {
    commit("setUserEmail", email);
  },

  updateImage({ commit }, { path }) {
    commit("setUserImage", path);
  },
};

export default createStore({
  state,
  mutations,
  actions,
  plugins: [
    createPersistedState({
      storage: window.localStorage, // Tránh rủi ro bảo mật từ cookies
    }),
  ],
});

const token = cookies.get("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
} 
