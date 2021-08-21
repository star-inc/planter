<template>
  <div>
    <v-list-group>
      <template #activator>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>
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
      <v-icon slot="prependIcon">
        {{ icon }}
      </v-icon>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-check</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            AAA
          </v-list-item-title>
          <v-list-item-subtitle>
            AAA
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action-text>
          AAA
        </v-list-item-action-text>
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "DateBar"
}
</script>
