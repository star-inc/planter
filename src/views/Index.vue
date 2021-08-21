<template>
  <v-container>
    <server-bar
        v-for="(i, k) in state"
        :key="k"
        :description="i.description"
        :metadata="i.metadata"
        :name="i.name"
        :services="i.services"
        :status="i.status"
    />
    <v-card flat>
      <v-card-text>
        Last incident occurred:
        {{ info.timestamp | moment("from") }}
      </v-card-text>
    </v-card>
    <v-card class="text-center" flat>
      <v-btn v-if="!more" @click="more = true">
        More
      </v-btn>
    </v-card>
    <v-expand-transition>
      <div v-if="more">
        <extra-services/>
        <scheduled-maintenance/>
        <incidents-overview/>
        <metrics-overview/>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script>
import ServerBar from "../components/Index/ServerBar";
import ExtraServices from "../components/Index/ExtraServices";
import IncidentsOverview from "../components/Index/IncidentsOverview";
import MetricsOverview from "../components/Index/MetricsOverview";
import ScheduledMaintenance from "../components/Index/ScheduledMaintenance";

export default {
  name: 'Index',
  components: {
    ScheduledMaintenance,
    MetricsOverview,
    IncidentsOverview,
    ExtraServices,
    ServerBar
  },
  data: () => ({
    more: false,
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
