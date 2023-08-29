<script setup lang="ts">
import CloseIcon from '../icons/Close.vue'
export interface Props {
  modelValue: string;
  tabs: Tab[]
}

export interface Tab {
  id: string
  title: string
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void
  (e: 'close', id: string): void
}>();


</script>

<template>
  <div class="Tabs">
    <div
      v-for="item in tabs"
      class="Tabs__tab"
      :class="{
        'Tabs__tab--active': item.id === props.modelValue,
      }"
      :key="item.id"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.title }}

      <CloseIcon 
        class="Tabs__close"
        @click.stop="emit('close', item.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.Tabs {
  display: flex;
}

.Tabs__tab {
  margin-right: 4px;
  padding: 10px 12px;
  border-radius: 8px 8px 0 0;
  background-color: cadetblue;
  min-width: 130px;

  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.Tabs__tab--active {
  background-color: cornflowerblue;
}

.Tabs__close {
  padding: 2px;
  border-radius: 3px;
  margin-left: 6px;
}

.Tabs__close:hover {
  background: rgba(0, 0, 0, .2);
}
</style>