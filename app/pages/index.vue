<template>
  <div class="min-h-screen bg-zinc-50/50 py-12 px-4 sm:px-6 lg:px-8 select-none">
    <UContainer class="max-w-4xl">
      <!-- Header Section with Title & Action Button -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-zinc-950 tracking-tight">
            Star Inc. System Status
          </h1>
          <p class="text-zinc-500 mt-1 text-sm">
            Real-time status updates for our services and platforms.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <UButton
            icon="i-heroicons-arrow-path"
            color="neutral"
            variant="outline"
            size="sm"
            :loading="loading"
            class="cursor-pointer"
            @click="fetchData"
          >
            Refresh
          </UButton>
          <UButton
            to="/raise"
            icon="i-heroicons-exclamation-triangle"
            color="primary"
            size="sm"
            class="cursor-pointer"
          >
            Report Issue
          </UButton>
        </div>
      </div>

      <!-- Overall Status Banner -->
      <div class="mb-8">
        <template v-if="loading">
          <USkeleton class="h-20 w-full rounded-2xl" />
        </template>
        <template v-else-if="systemStatus === 'operational'">
          <div class="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/10 flex items-center gap-4">
            <div class="p-3 bg-white/10 rounded-xl">
              <UIcon name="i-heroicons-check-circle-20-solid" class="w-8 h-8" />
            </div>
            <div>
              <h2 class="text-lg font-bold">All Systems Operational</h2>
              <p class="text-white/80 text-sm">We are monitoring all systems in real-time and no issues have been detected.</p>
            </div>
          </div>
        </template>
        <template v-else-if="systemStatus === 'partial_outage'">
          <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/10 flex items-center gap-4">
            <div class="p-3 bg-white/10 rounded-xl">
              <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 class="text-lg font-bold">Partial System Outage</h2>
              <p class="text-white/80 text-sm">Some services are currently experiencing performance issues or outages.</p>
            </div>
          </div>
        </template>
        <template v-else-if="systemStatus === 'major_outage'">
          <div class="p-5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/10 flex items-center gap-4">
            <div class="p-3 bg-white/10 rounded-xl">
              <UIcon name="i-heroicons-x-circle-20-solid" class="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h2 class="text-lg font-bold">Major System Outage</h2>
              <p class="text-white/80 text-sm">We are experiencing significant issues across multiple core services.</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="p-5 rounded-2xl bg-zinc-800 text-white flex items-center gap-4">
            <div class="p-3 bg-white/10 rounded-xl">
              <UIcon name="i-heroicons-information-circle-20-solid" class="w-8 h-8" />
            </div>
            <div>
              <h2 class="text-lg font-bold">No Monitored Nodes</h2>
              <p class="text-white/80 text-sm">No systems are currently configured for monitoring.</p>
            </div>
          </div>
        </template>
      </div>

      <!-- Node Groups / Cards -->
      <div v-if="loading" class="space-y-6">
        <USkeleton v-for="n in 2" :key="n" class="h-48 w-full rounded-2xl" />
      </div>
      <div v-else-if="dataset.length" class="space-y-6">
        <UCard
          v-for="(group, idx) in dataset"
          :key="idx"
          class="shadow-sm border border-zinc-200/80 rounded-2xl overflow-hidden"
          :ui="{ body: 'p-0 sm:p-0' }"
        >
          <!-- Card Header -->
          <template #header>
            <div class="px-5 py-4 bg-zinc-50 border-b border-zinc-200/80">
              <h3 class="font-bold text-zinc-900 text-base">{{ group.name }}</h3>
              <p v-if="group.description" class="text-zinc-500 text-xs mt-1">{{ group.description }}</p>
            </div>
          </template>

          <!-- Nodes List -->
          <div class="divide-y divide-zinc-100">
            <div v-for="node in group.nodes" :key="node.linkId" class="p-5">
              <!-- Parent Node Row -->
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                  <!-- Indicator -->
                  <div class="mt-1 flex items-center justify-center shrink-0">
                    <span class="relative flex h-3 w-3">
                      <span
                        v-if="isOperational(node.httpStatus)"
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                      />
                      <span
                        class="relative inline-flex rounded-full h-3 w-3"
                        :class="isOperational(node.httpStatus) ? 'bg-emerald-500' : 'bg-rose-500'"
                      />
                    </span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-zinc-950 text-sm">{{ node.name }}</span>
                      <a
                        v-if="node.httpUrl"
                        :href="node.httpUrl"
                        target="_blank"
                        rel="noreferrer noopener"
                        class="text-zinc-400 hover:text-primary transition-colors inline-flex items-center"
                      >
                        <UIcon name="i-heroicons-arrow-top-right-on-square-20-solid" class="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p v-if="node.description" class="text-zinc-500 text-xs mt-0.5 leading-relaxed">{{ node.description }}</p>
                  </div>
                </div>

                <!-- Status Badge -->
                <div class="shrink-0">
                  <UBadge
                    :color="isOperational(node.httpStatus) ? 'success' : 'danger'"
                    variant="soft"
                    size="sm"
                  >
                    {{ isOperational(node.httpStatus) ? 'Operational' : 'Outage' }}
                    <span v-if="node.httpStatus > 0" class="ml-1 text-[10px] opacity-80">({{ node.httpStatus }})</span>
                  </UBadge>
                </div>
              </div>

              <!-- Children Nodes (Nested) -->
              <div v-if="node.children && node.children.length" class="mt-4 pl-6 border-l-2 border-zinc-200/60 space-y-4">
                <div v-for="child in node.children" :key="child.linkId" class="flex items-center justify-between gap-4">
                  <div class="flex items-start gap-2.5">
                    <div class="mt-1 flex items-center justify-center shrink-0">
                      <span class="relative flex h-2.5 w-2.5">
                        <span
                          v-if="isOperational(child.httpStatus)"
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                        />
                        <span
                          class="relative inline-flex rounded-full h-2.5 w-2.5"
                          :class="isOperational(child.httpStatus) ? 'bg-emerald-500' : 'bg-rose-500'"
                        />
                      </span>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="font-medium text-zinc-900 text-xs">{{ child.name }}</span>
                        <a
                          v-if="child.httpUrl"
                          :href="child.httpUrl"
                          target="_blank"
                          rel="noreferrer noopener"
                          class="text-zinc-400 hover:text-primary transition-colors inline-flex items-center"
                        >
                          <UIcon name="i-heroicons-arrow-top-right-on-square-20-solid" class="w-3 h-3" />
                        </a>
                      </div>
                      <p v-if="child.description" class="text-zinc-400 text-[10px] mt-0.5 leading-relaxed">{{ child.description }}</p>
                    </div>
                  </div>

                  <div class="shrink-0">
                    <UBadge
                      :color="isOperational(child.httpStatus) ? 'success' : 'danger'"
                      variant="soft"
                      size="xs"
                    >
                      {{ isOperational(child.httpStatus) ? 'Operational' : 'Outage' }}
                      <span v-if="child.httpStatus > 0" class="ml-1 text-[9px] opacity-80">({{ child.httpStatus }})</span>
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty / None State -->
      <UCard v-else class="text-center p-8 border border-zinc-200/80 rounded-2xl">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-zinc-400 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-zinc-900">No Services Registered</h3>
        <p class="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">
          There are no nodes currently setup for monitoring. Please add nodes in your D1 database.
        </p>
      </UCard>

      <!-- Last Updated Timestamp Footer -->
      <div v-if="updatedAt" class="mt-8 text-center text-xs text-zinc-400 flex items-center justify-center gap-1">
        <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
        <span>Last updated: {{ formattedUpdatedAt }}</span>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';

useHead({
  title: 'Star Inc. System Status',
  meta: [
    {
      name: 'description',
      content: 'Real-time status updates and incident reporting for Star Inc. services.',
    },
  ],
});

interface Node {
  name: string;
  description: string;
  typeId: number | null;
  linkId: number;
  httpStatus: number;
  httpUrl: string | null;
  children?: Node[];
}

interface TypeConfig {
  name: string;
  description: string;
  priority: number;
}

const loading = ref(true);
const updatedAt = ref('');

const nodes = ref<Node[]>([]);
const types = ref<Record<number, TypeConfig>>({});
const links = ref<Record<number, number[]>>({});

const isOperational = (status: number) => status === 200 || status === 204;

const systemStatus = computed(() => {
  if (loading.value) return 'loading';
  if (!nodes.value.length) return 'empty';
  const downNodes = nodes.value.filter((n) => !isOperational(n.httpStatus));
  if (downNodes.length === 0) return 'operational';
  if (downNodes.length === nodes.value.length) return 'major_outage';
  return 'partial_outage';
});

const formattedUpdatedAt = computed(() => {
  if (!updatedAt.value) return 'Unknown';
  try {
    return new Date(updatedAt.value).toLocaleString();
  } catch {
    return updatedAt.value;
  }
});

const dataset = computed(() => {
  return Object.entries(types.value)
      .sort((i, j) => (i[1].priority < j[1].priority ? 1 : -1))
      .map(([typeIdStr, typeConfig]) => {
        const typeId = parseInt(typeIdStr, 10);
        const filteredNodes = nodes.value
            .filter((k) => k.typeId === typeId)
            .sort((i, j) => (i.name > j.name ? 1 : -1))
            .map((k) => {
              const childIds = links.value[k.linkId] || [];
              const children = childIds
                  .map((l) => nodes.value.find((m) => m.linkId === l))
                  .filter((m): m is Node => !!m)
                  .sort((i, j) => (i.name > j.name ? 1 : -1));
              return {
                ...k,
                children,
              };
            });

        return {
          ...typeConfig,
          nodes: filteredNodes,
        };
      })
      .filter((g) => g.nodes.length > 0);
});

interface NodesApiResponse {
  nodes: Node[];
  types: Record<number, TypeConfig>;
  links: Record<number, number[]>;
  updatedAt: string;
}

const fetchData = async () => {
  loading.value = true;
  try {
    const data = await $fetch<NodesApiResponse>('/api/nodes');
    nodes.value = data.nodes || [];
    updatedAt.value = data.updatedAt || '';
    types.value = data.types || {};
    links.value = data.links || {};
  } catch (err) {
    console.error('Failed to fetch status data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>
