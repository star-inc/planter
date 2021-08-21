<template>
  <v-list-item
      :class="className"
      :href="website"
      rel="noreferrer noopener"
      target="_blank"
  >
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
</template>

<script>
export default {
  name: "ServiceBar",
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
    website: {
      type: String,
      required: false,
      default: () => ""
    }
  },
  computed: {
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
          return "red";
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
          return "red--text";
        }
      }
    }
  }
}
</script>
