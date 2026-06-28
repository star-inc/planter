<template>
  <div class="min-h-screen bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8 select-none">
    <UContainer class="max-w-xl">
      <!-- Success Page -->
      <UCard v-if="sent" class="shadow-sm border border-zinc-200/80 rounded-2xl p-6 text-center">
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <UIcon name="i-heroicons-check-circle" class="w-10 h-10" />
        </div>
        <h2 class="text-2xl font-bold text-zinc-900">Issue Submitted</h2>
        <p class="text-zinc-500 mt-2 text-sm">
          Thanks for your reporting! The ticket you submitted will be processed as soon as possible.
        </p>
        <div class="mt-6 flex justify-center">
          <UButton color="primary" class="w-32 cursor-pointer" @click="onPressOK">
            OK
          </UButton>
        </div>
      </UCard>

      <!-- Form Page -->
      <UCard v-else class="shadow-sm border border-zinc-200/80 rounded-2xl">
        <template #header>
          <div class="px-2 py-1">
            <h2 class="text-xl font-bold text-zinc-950">Report an Issue</h2>
            <p class="text-zinc-500 text-xs mt-1">
              If there is any problem occurred and not reported at the status page, please report it here.
            </p>
          </div>
        </template>

        <UForm :state="state" :validate="validate" class="space-y-5" @submit="onSubmit">
          <!-- Title -->
          <UFormField label="Issue Title" name="title" required>
            <UInput v-model="state.title" placeholder="Brief summary of the issue" class="w-full" />
          </UFormField>

          <!-- Type -->
          <UFormField label="Issue Type" name="type" required>
            <USelect v-model="state.type" :items="types" placeholder="Select issue type" class="w-full" />
          </UFormField>

          <!-- Email -->
          <UFormField label="Your Email" name="contact" required>
            <UInput v-model="state.contact" type="email" placeholder="yourname@example.com" class="w-full" />
          </UFormField>

          <!-- Details -->
          <UFormField label="Issue Details" name="details" required>
            <UTextarea v-model="state.details" placeholder="Describe what went wrong..." :rows="4" class="w-full resize-none" />
          </UFormField>

          <!-- Turnstile Verification -->
          <UFormField name="turnstileToken">
            <div class="flex justify-center py-2 bg-zinc-50 border border-zinc-100 rounded-xl">
              <TurnstileWidget v-model="state.turnstileToken" :site-key="turnstileSiteKey" />
            </div>
          </UFormField>

          <!-- Checkbox 1 -->
          <UFormField name="allowTruthy" class="mt-2">
            <UCheckbox
              v-model="state.allowTruthy"
              label="I hereby certify the provided information is true and accurate, my IP address will be recorded."
            />
          </UFormField>

          <!-- Checkbox 2 -->
          <UFormField name="allowContact">
            <UCheckbox
              v-model="state.allowContact"
              label="The Email address will be used to contact with the issue only, won't be used for marketing."
            />
          </UFormField>

          <!-- Error Message Display -->
          <UAlert
            v-if="errorMessage"
            icon="i-heroicons-exclamation-triangle"
            color="error"
            variant="soft"
            title="Submission Failed"
            :description="errorMessage"
            class="rounded-xl mt-4"
          />

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t border-zinc-100">
            <UButton color="neutral" variant="outline" class="cursor-pointer" @click="onPressCancel">
              Cancel
            </UButton>
            <UButton type="submit" color="primary" :loading="loading" class="cursor-pointer">
              Submit Report
            </UButton>
          </div>
        </UForm>
      </UCard>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {useRouter} from 'vue-router';
import TurnstileWidget from '../components/TurnstileWidget.vue';

useHead({
  title: 'Report an Issue - Star Inc.',
  meta: [
    {
      name: 'description',
      content: 'Submit a new issue report regarding our platforms and services.',
    },
  ],
});

const config = useRuntimeConfig();
const turnstileSiteKey = (config.public.turnstileSiteKey as string) || '1x00000000000000000000AA';

const router = useRouter();

const types = [
  'Site Down',
  'App Crashes',
  'Network Issues',
  'Domain/DNS Issues',
  'TLS/SSL Issues',
  'Resource Missing',
  'Report Phishing/Malware',
  'Other/Unknown',
];

const state = reactive({
  title: '',
  type: '',
  contact: '',
  details: '',
  turnstileToken: '',
  allowTruthy: false,
  allowContact: false,
});

const sent = ref(false);
const loading = ref(false);
const errorMessage = ref('');

interface FormState {
  title: string;
  type: string;
  contact: string;
  details: string;
  turnstileToken: string;
  allowTruthy: boolean;
  allowContact: boolean;
}

const validate = (state: FormState) => {
  const errors = [];
  if (!state.title) errors.push({name: 'title', message: 'Required'});
  if (!state.type) errors.push({name: 'type', message: 'Required'});
  if (!state.contact) {
    errors.push({name: 'contact', message: 'Required'});
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(state.contact)) {
    errors.push({name: 'contact', message: 'Invalid Format'});
  }
  if (!state.details) errors.push({name: 'details', message: 'Required'});
  if (!state.turnstileToken) errors.push({name: 'turnstileToken', message: 'Please complete the Turnstile challenge'});
  if (!state.allowTruthy) errors.push({name: 'allowTruthy', message: 'Required'});
  if (!state.allowContact) errors.push({name: 'allowContact', message: 'Required'});
  return errors;
};

/**
 *
 */
async function onSubmit() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('type', state.type);
    formData.append('contact', state.contact);
    formData.append('details', state.details);
    formData.append('cf-turnstile-response', state.turnstileToken);

    await $fetch('/api/issues', {
      method: 'POST',
      body: formData,
    });

    sent.value = true;
  } catch (err) {
    console.error('Failed to submit issue:', err);
    const e = err as {data?: {statusMessage?: string}; message?: string};
    errorMessage.value = e.data?.statusMessage || e.message || 'An unknown error occurred';
  } finally {
    loading.value = false;
  }
}

/**
 *
 */
function onPressOK() {
  router.push('/');
}

/**
 *
 */
function onPressCancel() {
  router.push('/');
}
</script>
