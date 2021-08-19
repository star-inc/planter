<template>
  <div class="home">
    <server-bar
        v-for="(i, k) in state"
        :key="k"
        :children="i.children"
        :description="i.description"
        :metadata="i.metadata"
        :name="i.name"
        :status="i.status"
    />
  </div>
</template>

<script>
import ServerBar from "../components/ServerBar";

export default {
  name: 'Home',
  components: {
    ServerBar
  },
  data: () => ({
    state: {}
  }),
  async created() {
    const stateUrl = process.env.VUE_APP_STATE_JSON_URL;
    this.state = (await this.axios.get(stateUrl)).data
  }
}
</script>
