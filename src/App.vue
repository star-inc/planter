<template>
  <v-app light>
    <v-app-bar app fixed flat>
      <v-avatar class="ml-6">
        <v-img :src="iconUrl" :alt="title" />
      </v-avatar>
      <v-toolbar-title class="ml-2">
        {{ barTitle }}
      </v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list nav>
        <v-list-item href="https://github.com/star-inc/planter">
          <v-list-item-title class="text-h6">
            Planter
          </v-list-item-title>
          <v-list-item-subtitle>
            Status page of {{ barTitle }}.
          </v-list-item-subtitle>
        </v-list-item>
        <v-divider />
        <v-list-item link to="/">
          <v-list-item-title>
            {{ ("nav.index") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item link to="/incidents">
          <v-list-item-title>
            {{ ("nav.incidents") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item link to="/metrics">
          <v-list-item-title>
            {{ ("nav.metrics") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item link to="/subscribe">
          <v-list-item-title>
            {{ ("nav.subscribe") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item link to="/about">
          <v-list-item-title>
            {{ ("nav.about") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-2">
          <v-btn block class="primary" link rounded to="/raise">
            {{ ("nav.raise") }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const {
  VITE_APP_ICON_URL: iconUrl,
  VITE_APP_BAR_TITLE: barTitle,
} = import.meta.env;

const drawer = ref(false);
</script>
