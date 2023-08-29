<script setup lang="ts">
import { ref } from 'vue';
import Tabs, { Tab } from './Tabs.vue'

const tabs: Tab[] = [
  {
    id: '1',
    title: '123'
  },
  {
    id: '2',
    title: '2222'
  },
  {
    id: '3',
    title: '4444'
  },
]

const activeTab = ref(tabs[0].id)
</script>

<template>
  <div>
    <Tabs v-model="activeTab" :tabs="tabs"/>
    {{ activeTab }}
  </div>
</template>

<style scoped>
</style>