<template>
  <div>
    <v-list-group
        v-if="services.length"
        v-model="showServices"
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
      <service-bar
          v-for="i in services"
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
        <v-list-item-title :class="className">
          {{ name }}
        </v-list-item-title>
        <v-list-item-subtitle :class="className">
          {{ description }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import ServiceBar from "./ServiceBar";

export default {
  name: "ServerBar",
  components: {ServiceBar},
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
    services: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data: () => ({
    showServices: false,
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
          return !this.showServices
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
          return !this.showServices
              ? "red white--text"
              : "";
        }
      }
    }
  }
};
</script>
