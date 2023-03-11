<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> First Project CRUD </q-toolbar-title>
        <q-btn
          v-if="this.$router.currentRoute.value.fullPath === '/'"
          @click="signOut"
          icon="logout"
          label="Sign Out"
          color="primary"
        />
        <div v-else>Big Legal Analytics</div>
        <!-- <slot name="header-action" /> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer> -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useRouter } from "vue-router";
import store from "../store.js";
import axios from "axios";
import Cookies from "js-cookie";

export default defineComponent({
  name: "MainLayout",

  components: {
    // EssentialLink,
  },

  mounted() {
    const router = useRouter();
    const token = Cookies.get("token");

    axios
      .post("http://localhost:3000/get_user", { token })
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 200) {
          store.state.isLoggedIn = true;
          store.state.fullName = response.data.data.fullname;
          router.push("/");
        } else {
          this.signOut();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },

  methods: {
    signOut() {
      // Logika untuk log out
      if (
        this.$router.currentRoute.value.fullPath !== "/login" &&
        this.$router.currentRoute.value.fullPath !== "/register"
      ) {
        Cookies.remove("token");
        this.$router.push("/login");
        store.state.isLoggedIn = false;
      }
    },
  },

  setup() {
    // const leftDrawerOpen = ref(false);

    function logout() {}
    return {
      // essentialLinks: linksList,
      // leftDrawerOpen,
      // toggleLeftDrawer() {
      //   leftDrawerOpen.value = !leftDrawerOpen.value;
      // },
    };
  },
});
</script>
