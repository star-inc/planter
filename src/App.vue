<template>
  <v-app dark>
    <v-card
        :height="$store.state.screenSize.height"
        :width="$store.state.screenSize.width"
        class="mx-auto overflow-hidden"
    >
      <v-app-bar app fixed flat extended>
        <v-app-bar-title>
          <v-img
              src="@/assets/icon.png"
              width="39px"
              class="mr-1"
              alt="Logo"
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
          temporary
          absolute
          right
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
          <v-list-item link to="/about">
            <v-list-item-title>{{ $t("nav.about") }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn class="primary" block rounded>
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
    toolbarTitle() {
      return "p.<strong>mume</strong>"
    }
  },
  methods: {
    resize() {
      this.$store.commit('updateScreenSize', {
        width: window.innerWidth,
        height: window.innerHeight
      })
    },
    downloadConfig() {
      this.$axios.get()
    }
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
