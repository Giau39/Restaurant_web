import axios from "axios";
import store from "./store/index";
import router from "./router"; // Thêm router để chuyển hướng nếu cần
const token = store.state.token;




axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

let x = false;

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response.status === 401 && !x) {
      x = true;
      await store.dispatch("Logout");
      router.push("/login");
    }
  }
);