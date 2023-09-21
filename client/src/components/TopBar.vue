<template>
  <div class="HostInput">
    <input type="text" v-model="val"/>
    <span v-if="isLoading">Загркзка</span>
    <span v-if="fetchError">{{fetchError.message}}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, } from 'vue';

interface Props {
  host: string;
  isLoading: boolean;
  fetchError: Error;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  host: [string],
}>()

const val = computed({
  get(){
    return props.host
  },
  set(value: string) {
    emit('host', value)
  }
})


</script>

<style scoped>
.HostInput {
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

</style>