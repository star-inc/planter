<template>
  <v-container>
    <v-card v-if="sent" class="pb-2 px-2">
      <v-card-title>
        Issue Submitted
      </v-card-title>
      <v-card-subtitle>
        Thanks for your reporting!
      </v-card-subtitle>
      <v-card-text>
        The ticket you submitted will be processed as soon as possible.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="onPressOK">
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="pb-2 px-2">
      <v-form ref="ticketRef" @submit.prevent="onSubmit">
        <v-card-title>
          Raise Issue
        </v-card-title>
        <v-card-subtitle class="force-wrap">
          If there is any problem occurred and not reported at the status page.
        </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Issue Title" name="title" :rules="rules" required />
          <v-select label="Issue Type" name="type" :rules="rules" :items="types" required />
          <v-text-field label="Your Email" name="contact" :rules="rulesEmail" required />
          <v-textarea label="Issue Details" name="details" :rules="rules" no-resize required />
          <vue-turnstile :site-key="turnstileSiteKey" />
          <v-checkbox
            label="I hereby certify the provided information is true and accurate, my IP address will be recorded."
            name="allow-truthy" :rules="rules" required />
          <v-checkbox
            label="The Email address will be used to contact with the issue only, won't be used for marketing."
            name="allow-contact" :rules="rules" required />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" :loading="loading" type="submit">
            Submit
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
  <v-snackbar v-model="snackbar">
    {{ snackbarText }}
    <template v-slot:actions>
      <v-btn color="red" @click="onPressClose">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from "vue";

import { useRouter } from 'vue-router';

import VueTurnstile from 'vue-turnstile';

import {
  usePlanterClient,
} from "../clients/planter.js";

const {
  VITE_APP_TURNSTILE_SITE_KEY: turnstileSiteKey,
} = import.meta.env;

const router = useRouter();
const client = usePlanterClient();

const types = [
  "Site Down",
  "App Crashes",
  "Network Issues",
  "Domain/DNS Issues",
  "TLS/SSL Issues",
  "Resource Missing",
  "Report Phishing/Malware",
  "Other/Unknown"
];

const sent = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref("Unknown");

const ticketRef = ref(null);

const rules = [
  (v) => !!v || "Required",
];
const rulesEmail = [
  ...rules,
  (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Invalid Format"
];

async function onSubmit() {
  const { value: ticket } = ticketRef;
  const { valid } = await ticket.validate();
  if (!valid) {
    return;
  }

  try {
    loading.value = true;
    const values = new FormData(ticket.$el);
    await client.post("issues", {
      body: values,
    });
    sent.value = true;
  } catch (e) {
    snackbarText.value = e.message;
    snackbar.value = true;
  } finally {
    loading.value = false;
  }
}

function onPressOK() {
  router.push("/");
}

function onPressClose() {
  snackbar.value = false;
}
</script>

<style scoped>
.force-wrap {
  white-space: normal;
}
</style>
