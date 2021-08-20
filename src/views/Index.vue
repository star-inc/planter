<template>
  <v-container>
    <server-bar
        v-for="(i, k) in state"
        :key="k"
        :services="i.services"
        :description="i.description"
        :metadata="i.metadata"
        :name="i.name"
        :status="i.status"
    />
    <v-card flat>
      <v-card-text>
        Last incident occurred:
        {{ info.timestamp | moment("from") }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ServerBar from "../components/ServerBar";

export default {
  name: 'Home',
  components: {
    ServerBar
  },
  data: () => ({
    info: {
      timestamp: "never"
    },
    state: {}
  }),
  async created() {
    // Update Information
    const infoUrl = process.env.VUE_APP_UPDATE_JSON_URL;
    const infoResponse = await this.axios.get(infoUrl)
    if (infoResponse) this.info = infoResponse.data;
    // Update State
    const stateUrl = process.env.VUE_APP_STATE_JSON_URL;
    const stateResponse = await this.axios.get(stateUrl)
    if (stateResponse) this.state = stateResponse.data;
  }
}
</script>
