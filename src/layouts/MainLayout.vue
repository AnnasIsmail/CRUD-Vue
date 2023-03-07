<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> First Project CRUD </q-toolbar-title>

        <div>Legal Analytics</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Binusmaya",
    caption: "binusmaya.binus.ac.id",
    icon: "school",
    link: "https://newbinusmaya.binus.ac.id",
  },
  {
    title: "Annas's Github",
    caption: "github.com/AnnasIsmail",
    icon: "code",
    link: "https://github.com/AnnasIsmail",
  },
  {
    title: "Farhan's Github ",
    caption: "github.com/fluorineheit",
    icon: "code",
    link: "https://github.com/fluorineheit",
  },
  {
    title: "Laras' Github",
    caption: "github.com/lareinalaras",
    icon: "code",
    link: "https://github.com/lareinalaras",
  },
  {
    title: "Farhan's Twitter",
    caption: "@Fluorine_heit",
    icon: "public",
    link: "https://twitter.com/Fluorine_heit",
  },
  {
    title: "Laras' Spotify",
    caption: "open.spotify.com/Lareina.",
    icon: "favorite",
    link: "https://open.spotify.com/user/5aqfmockw7lqjstjxps5x3ruj?si=e80ed56121184955",
  },
  {
    title: "Spotify orang ganteng",
    caption: "Klik saya",
    icon: "favorite",
    link: "https://open.spotify.com/user/21w5qjfckoxkiy4kaf53tqp5i?si=zfbgue8mSjyQecl9Cih8UQ",
  },
  {
    title: "Annas's Youtube",
    caption: "Click me",
    icon: "favorite",
    link: "https://www.youtube.com/channel/UCWBDexy4KU6WrHwR74B-Nfg",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
