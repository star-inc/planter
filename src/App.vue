<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="overlap">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>

          <span class="md-title">
            <img class="logo" alt="p.mume" src="@/assets/logo.svg" />
          </span>
        </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">
          <img class="logo" alt="p.mume" src="@/assets/logo.svg" />
        </md-toolbar>

        <md-list>
          <md-list-item @click="home">
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item @click="incidents">
            <md-icon>book</md-icon>
            <span class="md-list-item-text">Incidents</span>
          </md-list-item>

          <md-list-item @click="subscribe">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Subscribe</span>
          </md-list-item>

          <md-list-item @click="star">
            <md-icon>star</md-icon>
            <span class="md-list-item-text">Star Inc.</span>
          </md-list-item>

          <md-list-item @click="about">
            <md-icon>info</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
       <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: "Application",
  methods: {
    _routerMove(targetName){
      if (targetName != this.$route.name) {
        this.$router.push({ name: targetName });
      }
      this.menuVisible = false;
    },
    home() {
      this._routerMove("Status");
    },
    incidents() {
      this._routerMove("Incidents");
    },
    subscribe() {
      this._routerMove("Subscribe");
    },
    star: () => (location.href = "https://starinc.xyz"),
    about() {
      this._routerMove("About");
    },
  },
  data: () => ({
    menuVisible: false,
  }),
};
</script>

<style lang="scss" scoped>
.md-app {
  width: 100%;
  height: 100vh;
}

.md-toolbar {
  background: #fff;
}

.md-drawer {
  width: 250px;
}

.logo {
  width: auto;
  height: 100px;
  padding: 15px;
}
</style>
