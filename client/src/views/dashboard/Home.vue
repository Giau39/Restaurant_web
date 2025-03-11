<template>
  <div class="dash-view">
    <SideBar />
    <main class="has-scrollbar">
      <Header />
      <div class="container">
        <div class="row">
          <div v-for="(item, index) in stats" :key="index" class="col-lg-3 col-md-4 col-6 mb-4">
            <div class="stat-box">
              <i :class="item.icon"></i>
              {{ item.value }} {{ item.label }}
            </div>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-lg-6 col-12 mb-4">
            <Statisfaction />
          </div>
          <div class="col-lg-6 col-12 mb-4">
            <div class="last-orders"><Calender /></div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <teleport to="body"> <SpinnerLoading :loading="state.loading" /> </teleport>
</template>

<script>
import SideBar from "@/components/dashboard/SideBar.vue";
import Header from "@/components/dashboard/Header.vue";
import Statisfaction from "@/components/dashboard/home/Statisfaction.vue";
import Calender from "@/components/dashboard/home/Calender.vue";
import SpinnerLoading from "@/components/SpinnerLoading.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive, computed, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  components: { SideBar, Header, Statisfaction, Calender, SpinnerLoading },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      loading: false,
      user: computed(() => store.state.user),
      stats: [],
    });

    onMounted(async () => {
      if (!state.user || !state.user.role) {
        router.push("/");
        return;
      }

      state.loading = true;

      try {
        // Gọi tất cả API song song
        const [usersRes, dishRes, orderRes] = await Promise.all([
          axios.get("/api-dashboard/users/stats"),
          axios.get("/api-dashboard/dishes/stats"),
          axios.get("/api-dashboard/orders/stats"),
        ]);

        // Gán dữ liệu vào mảng stats
        state.stats = [
          { label: "User", value: usersRes.data.stats.number, icon: "fa-solid fa-users fa-fade" },
          { label: "Dish", value: dishRes.data.stats.number, icon: "fa-solid fa-bowl-food fa-flip" },
          { label: "Order", value: orderRes.data.orders, icon: "fa-solid fa-truck-fast fa-shake" },
          { label: "Revenue", value: `${orderRes.data.revenue}$`, icon: "fa-solid fa-dollar-sign fa-bounce" },
        ];
      } catch (err) {
        toast.warning("Failed to fetch statistics. Please try again.");
      }

      state.loading = false;
    });

    return { state };
  },
};
</script>

<style lang="scss" scoped>
.dash-view {
  display: flex;
  main {
    height: 100vh;
    flex: 1;
    background: #fff;
    overflow: auto;
    padding-left: 18rem;
    @media (max-width: 991px) {
      padding-left: 0;
    }
    .stat-box {
      display: grid;
      place-content: center;
      width: 100%;
      height: 200px;
      background: var(--dark-orange);
      border-radius: 15px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
      text-align: center;
      font-size: 1.6rem;
      color: #fff;
      transition: transform 0.3s ease;
      position: relative;
      &:hover {
        transform: scale(1.05);
      }
      i {
        position: absolute;
        right: -15px;
        bottom: -15px;
        font-size: 6rem;
        opacity: 0.7;
      }
    }
  }
}
</style>
