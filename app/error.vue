<template>
  <nuxt-layout>
    <div class="w-full">
      <div class="w-3/4 mx-auto my-16 md:w-1/2 lg:w-1/3">
        <div class="mb-7">
          <div class="text-lg mb-2 text-slate-600">
            發生了錯誤
          </div>
          <div class="text-base mb-2 text-slate-500">
            {{ displayErrorMessage }}
          </div>
        </div>
        <div class="w-full flex justify-end">
          <button class="px-4 py-2 text-white bg-teal-300 rounded hover:bg-teal-500 cursor-pointer" @click="onClickGoHome">
            <HomeIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </nuxt-layout>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {HomeIcon} from '@heroicons/vue/24/outline';

const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage?: string;
  };
}>();

const router = useRouter();

const displayErrorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return '您所請求的頁面並不存在';
  } else {
    return `非預期的錯誤：${props.error?.statusCode} "${props.error?.statusMessage ?? ''}"`;
  }
});

/**
 *
 */
function onClickGoHome() {
  router.push('/');
}
</script>
