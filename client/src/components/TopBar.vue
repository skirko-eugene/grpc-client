<template>
  <div>
    <form @submit.prevent="emit('host', _value)">
      <input type="text" v-model="_value"/>
      <button>Получить</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Props {
  host: string;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  host: [string],
}>()

const _value = ref();

watch(() => props.host, (val) => {
  _value.value = val;
}, {
  immediate: true,
})
</script>

<style scoped>
form {
  width: 100%;
  background: rgb(var(--color-2));
  
  display: flex;
  align-items: center;
  grid-area: topline;
}

input[type="text"] {
  flex-grow: 0.4;
  border: none;
  /* border: 1px solid red; */
  border-radius: 3px;
  box-sizing: border-box;
  margin: 6px 8px;
  padding: 4px 20px;
  color: rgba(var(--color-font), .6);

  box-shadow: none;

  font: inherit;
  font-size: 15px;
}
input[type="text"]:focus {
  color: rgb(var(--color-font));
}

form button {
  padding: 0px 10px;
  margin: 3px 8px 3px 0;
  height: 32px;
  border-radius: 3px;
}
</style>