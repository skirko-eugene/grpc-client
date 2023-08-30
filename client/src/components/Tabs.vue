<script setup lang="ts">
import CloseIcon from '../icons/Close.vue'
import PlusCircle from '../icons/PlusCircle.vue'

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
  (e: 'create'): void
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

    <div
      class="Tabs__create"
      @click="emit('create')">
      <PlusCircle
        class="Tabs__create-icon"
      />
    </div>
  </div>
</template>

<style scoped>
.Tabs {
  display: flex;
  align-items: center;
}

.Tabs__tab {
  margin-right: 4px;
  padding: 10px 4px 10px 12px;
  background-color: rgb(var(--color-2));
  min-width: 130px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.Tabs__tab--active {
  background-color: cornflowerblue;
}

.Tabs__create {
  display: flex;
  cursor: pointer;
  transition: opacity .2s ease;

  margin: 7px 2px;
}

.Tabs__create:hover {
  opacity: .6;
}

.Tabs__create-icon {
  padding: 5px;
}

.Tabs__close {
  padding: 2px;
  border-radius: 4px;
  margin-left: 6px;
}

.Tabs__close:hover {
  background: rgba(0, 0, 0, .2);
}
</style>