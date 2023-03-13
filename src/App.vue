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
<style>
body {
  background-image: url("assets/background.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  /* background-color: #dcdcdc; */
  /* background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2381001f' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E"); */
}
</style>
