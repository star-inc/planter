<template>
  <div>
    <v-list-group
        v-if="children.length"
        v-model="showChildren"
        :class="className"
        :color="color"
        no-action
    >
      <template #activator>
        <v-list-item-content>
          <v-list-item-title :class="className">
            {{ name }}
          </v-list-item-title>
          <v-list-item-subtitle :class="className">
            {{ description }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <v-icon slot="prependIcon" :color="iconColor">
        {{ icon }}
      </v-icon>
      <site-bar
          v-for="i in children"
          :key="i.name"
          :description="i.description"
          :metadata="i.metadata"
          :name="i.name"
          :status="i.status"
          :website="i.website"
      />
    </v-list-group>
    <v-list-item v-else :class="className">
      <v-list-item-icon>
        <v-icon :color="iconColor">
          {{ icon }}
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>
          {{ name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ description }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import SiteBar from "./SiteBar";

export default {
  name: "ServerBar",
  components: {SiteBar},
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      required: true,
    },
    metadata: {
      type: String,
      required: false,
      default: () => ""
    },
    children: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data: () => ({
    showChildren: false,
  }),
  computed: {
    color() {
      switch (this.status) {
        case 200:
        case 204: {
          return "primary";
        }
        default: {
          return "red";
        }
      }
    },
    icon() {
      switch (this.status) {
        case 200:
        case 204: {
          return "mdi-check-circle-outline";
        }
        default: {
          return "mdi-alert-circle-outline";
        }
      }
    },
    iconColor() {
      switch (this.status) {
        case 200:
        case 204: {
          return "";
        }
        default: {
          return !this.showChildren
              ? "white"
              : "red";
        }
      }
    },
    className() {
      switch (this.status) {
        case 200:
        case 204: {
          return "";
        }
        default: {
          return !this.showChildren
              ? "red white--text"
              : "";
        }
      }
    }
  }
};
</script>
