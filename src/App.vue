<template>
  <router-view />
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import store from "./store";

export default defineComponent({
  name: "App",
  setup() {
    const leftDrawerOpen = ref(false);

    function logout() {
      store.commit("logout");
    }
    return {
      leftDrawerOpen,
      isLoggedIn: computed(() => store.state.isLoggedIn),
      logout,
    };
  },
});
</script>
