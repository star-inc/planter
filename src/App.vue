<template>
  <v-app dark>
    <v-card
        :height="$store.state.screenSize.height"
        :width="$store.state.screenSize.width"
        class="mx-auto overflow-hidden"
    >
      <v-app-bar app extended fixed flat>
        <v-app-bar-title>
          <v-img
              :src="toolbarLogoUrl"
              alt="Logo"
              class="mr-1"
              width="39px"
          />
        </v-app-bar-title>
        <v-toolbar-title v-html="toolbarTitle"/>
        <v-spacer/>
        <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
        />
      </v-app-bar>
      <v-navigation-drawer
          v-model="drawer"
          absolute
          right
          temporary
      >
        <v-list nav>
          <v-list-item href="https://github.com/star-inc/p.mume">
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                p.mume
              </v-list-item-title>
              <v-list-item-subtitle>
                version: 2.0-beta
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider/>
          <v-list-item link to="/">
            <v-list-item-title>{{ $t("nav.index") }}</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/incidents">
            <v-list-item-title>{{ $t("nav.incidents") }}</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/metrics">
            <v-list-item-title>{{ $t("nav.metrics") }}</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/subscribe">
            <v-list-item-title>{{ $t("nav.subscribe") }}</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/about">
            <v-list-item-title>{{ $t("nav.about") }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <template #append>
          <div class="pa-2">
            <v-btn block class="primary" rounded>
              Raise Issue
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main>
        <div>
          <router-view/>
        </div>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    status: false,
  }),
  computed: {
    toolbarLogoUrl() {
      const logoUrl = process.env.VUE_APP_LOGO_URL;
      return logoUrl || "default.png";
    },
    toolbarTitle() {
      const appTitle = process.env.VUE_APP_TITLE;
      return appTitle || "p.<strong>mume</strong>";
    }
  },
  methods: {
    resize() {
      this.$store.commit('updateScreenSize', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    },
  },
  async created() {
    this.resize()
    window.addEventListener("resize", this.resize)
  },
  destroyed() {
    window.removeEventListener("resize", this.resize)
  }
}
</script>
