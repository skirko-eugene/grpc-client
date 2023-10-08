<template>
  <div
    class="inputHost"
    :class="computedClass"
  >
    <label for="inputHost">API</label>
    <div class="inputHost__list"><IconList /></div>
    <input type="text" v-model="val" id="inputHost" @blur="focusOut" @focus="focusIn" />
    <span v-if="isLoading">Загркзка</span>
    <span v-if="fetchError">{{fetchError.message}}</span>
    <div class="inputHost__enter"><IconEnter /></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { type InputHostProps } from './interfaces';
import IconEnter from '../../icons/IconEnter.vue';
import IconList from '../../icons/IconList.vue';

const props = defineProps<InputHostProps>();

const emit = defineEmits<{
  host: [string],
}>();

const val = computed({
  get(){
    return props.host
  },
  set(value: string) {
    emit('host', value)
  }
});

const focusFlag = ref(false);

const focusIn = () => {
  focusFlag.value = true;
}
const focusOut = () => {
  focusFlag.value = false;
}

const computedClass = computed(() => {
  return {
    'inputHost--focus': focusFlag.value,
  }
});
</script>

<style lang="postcss" scoped>
.inputHost {
  max-width: 300px;
  border-radius: var(--radius-s);
  border: 1px solid rgb(var(--gray03));
  background-color: rgb(var(--gray02));
  display: flex;
  align-items: center;
  position: relative;
  & label {
    display: block;
    position: absolute;
    left: 10px;
    top: -20px;
    color: rgb(var(--gray06));
    font-size: 12px;
    line-height: 1;
  }
}

.inputHost--focus {
  border-color: rgb(var(--gray04))
}

input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  box-shadow: none;
  margin: 0;
  outline: 0;
  border: 0;
  padding: 5px 10px 6px;
  background-color: transparent;
  color: rgb(var(--gray07));
  font-family: var(--defaultFont);
  font-size: 13px;
  line-height: 1;
  letter-spacing: 0.3px;
}

.inputHost__list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-right: 1px solid rgb(var(--gray03));
  width: 36px;
  height: 36px;
  overflow: hidden;
  cursor: pointer;
  & svg {
    width: 16px;
    height: 16px;
    --color: rgb(var(--gray05));
  }
  &:hover {
    & svg {
      --color: rgb(var(--gray07));
    }
  }
}
.inputHost__enter {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  overflow: hidden;
  cursor: pointer;
  & svg {
    width: 16px;
    height: 16px;
    --color: rgb(var(--gray05));
  }
  &:hover {
    & svg {
      --color: rgb(var(--gray07));
    }
  }
}
</style>