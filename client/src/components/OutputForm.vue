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
  margin: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, .1);
  border-radius: 20px;
}
.json-markup-key {
  color: #ff8282;
}
.json-markup-string {
    color: #9af69a;
}
</style>