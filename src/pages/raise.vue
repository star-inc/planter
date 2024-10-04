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
        <v-card-subtitle>
          If there is any problem occurred and not reported at the status page.
        </v-card-subtitle>
        <v-card-text>
          <v-text-field label="Title" name="title" :rules="rules" required />
          <v-select label="Type" name="type" :rules="rules" :items="types" required />
          <v-textarea label="Details" name="details" :rules="rules" no-resize required />
          <vue-turnstile :site-key="turnstileSiteKey" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" type="submit">
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
  "Other"
];

const sent = ref(false);
const snackbar = ref(false);
const snackbarText = ref("Unknown");

const ticketRef = ref(null);

const rules = [
  (v) => !!v || "Required",
];

async function onSubmit() {
  const { value: ticket } = ticketRef;
  const { valid } = await ticket.validate();
  if (!valid) {
    return;
  }

  try {
    const values = new FormData(ticket.$el);
    await client.post("issues", {
      body: values,
    });
    sent.value = true;
  } catch (e) {
    snackbarText.value = e.message;
    snackbar.value = true;
  }
}

function onPressOK() {
  router.push("/");
}

function onPressClose() {
  snackbar.value = false;
}
</script>
