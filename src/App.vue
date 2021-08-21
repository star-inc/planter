<template>
  <v-app dark>
    <v-card
        :height="$store.state.screenSize.height"
        :width="$store.state.screenSize.width"
        class="mx-auto overflow-hidden"
    >
      <v-app-bar :extended="flexible[0]" app fixed flat>
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
            <v-btn block class="primary" link rounded to="/raise">
              {{ $t("nav.raise") }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main>
        <v-card
            :height="$store.state.screenSize.height - flexible[1]"
            :width="$store.state.screenSize.width"
            class="mx-auto overflow-y-auto"
            @scroll="mainScrolled"
            flat
        >
          <router-view/>
        </v-card>
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
    scrolled: false,
  }),
  computed: {
    flexible() {
      return this.scrolled ? [false, 60] : [true, 105];
    },
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
    mainScrolled(e) {
      this.scrolled = e.target.scrollTop > 100
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
