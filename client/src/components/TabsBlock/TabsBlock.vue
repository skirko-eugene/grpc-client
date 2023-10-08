<template>
  <div class="tabsBlock">
    <div
      v-for="item in tabs"
      class="tabsBlock__tab"
      :class="computedClass(item)"
      :key="item.id"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.title }}
      <div
        v-if="tabs.length > 1"
        class="tabsBlock__close"
        @click.stop="emit('close', item.id)"
      ><IconCross /></div>
    </div>
    <div class="tabsBlock__create" @click="emit('create')">
      <IconPlus />
    </div>
    <div class="tabsBlock__more">
      <IconMore />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconCross from '../../icons/IconCross.vue';
import IconPlus from '../../icons/IconPlus.vue';
import IconMore from '../../icons/IocnMore.vue';
import { Props, Tab } from './interfaces';

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: string): void
  (e: 'close', id: string): void
  (e: 'create'): void
}>();

const computedClass = computed(() => {
  return (item: Tab) => {
    return {
      'tabsBlock__tab--active': item.id === props.modelValue
    }
  }
})

</script>

<style lang="postcss" scoped>
.tabsBlock {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(var(--gray03));
  user-select: none;
}

.tabsBlock__tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 220px;
  padding: 10px 10px 10px 20px;
  border-right: 1px solid rgb(var(--gray04));
  position: relative;
  background-color: rgb(var(--gray02));
  font-family: var(--mediumFont);
  font-size: 12px;
  letter-spacing: 0.3px;
  cursor: pointer;
  &:hover {
    & .tabsBlock__close {
      display: flex;
    }
  }
}

.tabsBlock__tab--active {
  background-color: rgb(var(--gray03));
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(var(--yellow01));
  }
  & .tabsBlock__close {
    display: flex;
  }
}

.tabsBlock__create-icon {
  padding: 5px;
}

.tabsBlock__close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  & svg {
    width: 16px;
    height: 16px;
    --color: rgb(var(--gray05));
  }
  &:hover {
    background-color: rgba(var(--gray05), 0.1);
    & svg {
      --color: rgb(255,255,255);
    }
  }
}

.tabsBlock__create, .tabsBlock__more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 20px;
  border-radius: var(--radius-m);
  --color: rgb(var(--gray05));
  cursor: pointer;
  &:hover {
    background-color: rgba(var(--gray05), 0.1);
    & svg {
      --color: rgb(255,255,255);
    }
  }
}

.tabsBlock__more {
  margin-left: 8px;
}
</style>