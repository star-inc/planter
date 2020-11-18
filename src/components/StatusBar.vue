<template>
  <div @click="displayItem">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <md-toolbar
      :class="`${getType(information)} ${info[information.status].background}`"
    >
      <div class="item-info">
        <h1>{{ information.name }}</h1>
        <p>{{ information.description }}</p>
      </div>
      <div class="item-status">
        <md-icon class="fa" :class="info[information.status].icon"></md-icon>
      </div>
    </md-toolbar>
    <div v-show="showChildren" :class="animate">
      <StatusBar
        class="item-directory-mini"
        v-for="(item, itemIndex) in information.children"
        :key="itemIndex"
        :information="item"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusBar",
  props: {
    information: Object,
  },
  methods: {
    getType(item) {
      return "children" in item ? "item-directory" : "";
    },
    async displayItem() {
      setTimeout(() => {
        this.showChildren = !this.showChildren;
        this.animate = this.showChildren ? "falldown" : "";
      }, 300);
    },
  },
  data: () => ({
    info: [
      {
        icon: "fa-question",
        background: "unknown",
      },
      {
        icon: "fa-ban",
        background: "danger",
      },
      {
        icon: "fa-check",
        background: "access",
      },
      {
        icon: "fa-wrench",
        background: "maintaining",
      },
    ],
    showChildren: false,
    animate: "",
  }),
};
</script>

<style lang="scss" scoped>
.md-toolbar {
  margin: 10px 0;
  justify-content: space-between;
}

.item-directory {
  cursor: pointer;
}

.item-directory-mini {
  margin-left: 30px;
}

.falldown {
  animation-name: falldown;
  animation-duration: 1s;
}

@keyframes falldown {
  0% {
    opacity: 0;
    transform: translateY(-100px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.item-info {
  padding: 10px;
}

.item-status {
  padding: 10px 15px;
}

.access {
  background-color: #00afa0 !important;
}

.danger {
  background-color: #a90000 !important;
}

.maintaining {
  background-color: #aa9900 !important;
}

.unknown {
  background-color: #aaaaaa !important;
}
</style>
