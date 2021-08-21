<template>
  <v-container>
    <v-card class="pb-2 px-2">
      <v-card-title>
        Raise Issue
      </v-card-title>
      <v-card-subtitle>
        If there is any problem occurred and not reported at the status page.
      </v-card-subtitle>
      <v-card-text>
        <v-text-field label="Title"/>
        <v-select
            :items="items"
            label="Type"
        />
        <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            min-width="auto"
            offset-y
            transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                v-model="date"
                v-bind="attrs"
                v-on="on"
                label="Occurred Date"
                prepend-icon="mdi-calendar"
                readonly
            />
          </template>
          <v-date-picker
              v-model="date"
              :active-picker.sync="activePicker"
              :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
              min="1950-01-01"
              @change="save"
          />
        </v-menu>
        <v-textarea label="Details" no-resize/>
      </v-card-text>
      <v-card-actions>
        <v-btn class="primary">
          Issue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Raise",
  data: () => ({
    activePicker: null,
    menu: null,
    date: null,
    items: []
  }),
  methods: {
    save(e) {
      console.log(e)
    }
  }
}
</script>
