<template>
  <v-app light>
    <v-app-bar app fixed flat>
      <v-avatar class="ml-6 cursor-pointer" @click="onPressLogo">
        <v-img :src="iconUrl" :alt="title" />
      </v-avatar>
      <v-toolbar-title class="ml-2 cursor-pointer" @click="onPressLogo">
        {{ barTitle }}
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <app-nav-drawer v-model="drawer" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

import { useRouter } from "vue-router";

import AppNavDrawer from "./components/AppNavDrawer.vue";

const {
  VITE_APP_ICON_URL: iconUrl,
  VITE_APP_BAR_TITLE: barTitle,
} = import.meta.env;

const router = useRouter();

const drawer = ref(false);

function onPressLogo() {
  router.push("/");
}
</script>
