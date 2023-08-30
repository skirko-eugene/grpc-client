<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Tabs from './Tabs.vue'
import HelloWorld from './HelloWorld.vue';
import { useTabs, } from '../hooks/useTabs'

const {
  tabsData: tabs,
  create,
  del,
  activeTab,
} = useTabs()



</script>

<template>
  <div>
    <Tabs
      v-model="activeTab"
      :tabs="tabs"
      @create="create"
      @close="del($event)"
    />
    <HelloWorld />
  </div>
</template>

<style scoped>
</style>