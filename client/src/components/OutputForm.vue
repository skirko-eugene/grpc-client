<template>
  <div class="qwe" v-html="marked"></div>
</template>

<script lang="ts" setup>
// @ts-ignore
import jsonMarkup from 'json-markup';
import 'json-markup/style.css'
import { computed } from 'vue';

interface Props {
  result: any;
}

const props = defineProps<Props>()

const marked = computed(() => {
  console.log(props.result)
  return jsonMarkup(props.result)
})

</script>

<style >
.qwe {
  padding: 10px;
  border: 1px solid rgb(var(--gray03));
  border-radius: var(--radius-l);
  color: rgb(var(--gray07));
}
.json-markup-key {
  color: #ff8282;
}
.json-markup-string {
    color: #9af69a;
}
</style>