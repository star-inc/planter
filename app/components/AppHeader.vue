<template>
  <header class="sticky top-0 bg-white/80 backdrop-blur-md border-b border-zinc-200/60 z-40 transition-all duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Brand logo -->
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 font-semibold text-lg text-zinc-900 tracking-tight hover:text-zinc-600 transition-colors"
          >
            <span>Star Inc.</span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation links -->
        <nav class="hidden md:flex space-x-1 items-center h-full">
          <div
            v-for="item in menuItems"
            :key="item.title"
            class="relative group h-full flex items-center"
          >
            <!-- With children (Dropdown) -->
            <div v-if="item.children" class="h-full flex items-center">
              <button class="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60 rounded-lg flex items-center gap-1 transition-all duration-150 cursor-pointer border-0 bg-transparent">
                <span>{{ item.title }}</span>
                <ChevronDownIcon class="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              <!-- Dropdown panel -->
              <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 w-80">
                <div class="bg-white border border-zinc-200/80 rounded-xl shadow-xl overflow-hidden p-2 grid gap-1">
                  <button
                    v-for="sub in item.children"
                    :key="sub.title"
                    class="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 hover:text-zinc-950 transition-colors group/item cursor-pointer border-0 bg-transparent"
                    @click="executeAction(sub.action)"
                  >
                    <div class="p-2 rounded-lg bg-zinc-50 group-hover/item:bg-white border border-zinc-100 transition-colors shrink-0">
                      <DynamicHeroiconOutline :name="sub.icon" class="w-5 h-5 text-zinc-500 group-hover/item:text-zinc-900" />
                    </div>
                    <div>
                      <span class="block text-sm font-medium text-zinc-900">{{ sub.title }}</span>
                      <span class="block text-xs text-zinc-500 mt-0.5 leading-normal">{{ sub.description }}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <!-- Single Link -->
            <button
              v-else
              class="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60 rounded-lg transition-all duration-150 cursor-pointer border-0 bg-transparent"
              @click="executeAction(item.action)"
            >
              {{ item.title }}
            </button>
          </div>
        </nav>

        <!-- Mobile Menu Trigger -->
        <div class="md:hidden flex items-center">
          <button
            class="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
            aria-label="Open Menu"
            @click="isMobileMenuOpened = true"
          >
            <Bars4Icon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer menu -->
    <Transition name="slide-drawer">
      <div v-show="isMobileMenuOpened" class="fixed inset-y-0 right-0 w-80 bg-white border-l border-zinc-200 z-[100] shadow-2xl flex flex-col md:hidden">
        <!-- Drawer Header -->
        <div class="h-16 flex items-center justify-between px-6 border-b border-zinc-100 shrink-0">
          <span class="font-semibold text-zinc-900 text-lg">Star Inc.</span>
          <button
            class="p-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
            @click="isMobileMenuOpened = false"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div v-for="item in menuItems" :key="item.title" class="space-y-1">
            <!-- Accordion Trigger if item has children -->
            <div v-if="item.children">
              <button
                class="w-full flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-800 font-medium text-sm cursor-pointer border-0 bg-transparent"
                @click="toggleMobileSubmenu(item.title)"
              >
                <span>{{ item.title }}</span>
                <ChevronDownIcon
                  class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                  :class="{ 'rotate-180 text-zinc-700': openMobileSubmenus[item.title] }"
                />
              </button>
              <!-- Accordion content -->
              <div
                v-show="openMobileSubmenus[item.title]"
                class="mt-1 ml-3 pl-3 border-l border-zinc-100 space-y-1 py-1"
              >
                <button
                  v-for="sub in item.children"
                  :key="sub.title"
                  class="w-full text-left flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer border-0 bg-transparent"
                  @click="executeAction(sub.action)"
                >
                  <div class="p-1.5 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0">
                    <DynamicHeroiconOutline :name="sub.icon" class="w-4 h-4 text-zinc-500" />
                  </div>
                  <div>
                    <span class="block text-xs font-semibold text-zinc-950">{{ sub.title }}</span>
                    <span class="block text-[10px] text-zinc-500 mt-0.5 leading-normal">{{ sub.description }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Direct item without children -->
            <button
              v-else
              class="w-full text-left p-3 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-800 font-medium text-sm cursor-pointer border-0 bg-transparent"
              @click="executeAction(item.action)"
            >
              {{ item.title }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Drawer Backdrop -->
    <Transition name="fade-backdrop">
      <div
        v-show="isMobileMenuOpened"
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-[99] md:hidden"
        @click="isMobileMenuOpened = false"
      />
    </Transition>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {Bars4Icon, XMarkIcon, ChevronDownIcon} from '@heroicons/vue/24/outline';
import {getMenuItems} from './MenuItems';

const menuItems = getMenuItems();

const isMobileMenuOpened = ref(false);
const openMobileSubmenus = reactive<Record<string, boolean>>({});

const toggleMobileSubmenu = (title: string) => {
  openMobileSubmenus[title] = !openMobileSubmenus[title];
};

const executeAction = (action?: () => void) => {
  if (action) {
    action();
  }
  isMobileMenuOpened.value = false;
};
</script>

<style scoped>
.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-drawer-enter-from,
.slide-drawer-leave-to {
  transform: translateX(100%);
}

.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}
</style>
