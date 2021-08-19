<template>
  <v-list-item :class="className">
    <v-list-item-icon>
      <v-icon :color="iconColor">mdi-school</v-icon>
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
  name: "SiteBar",
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
    }
  },
  computed: {
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
