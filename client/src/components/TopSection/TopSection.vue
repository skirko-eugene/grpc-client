<template>
  <div class="topSection">
    <InputHost
      :host="host"
      :isLoading="isLoading"
      :fetchError="fetchError"
      @host="onHost"
    />
  </div>
</template>
<script lang="ts" setup>
import { type TopSectionProps } from './interfaces';
import InputHost from '../InputHost';

const props = defineProps<TopSectionProps>()

const emit = defineEmits<{
  host: [string],
}>();

const onHost = (item: string) => {
  emit('host', item);
}

</script>
<style lang="postcss">
/* ------------------------------------------------------------------------- */

.topSection {
  display: flex;
  gap: 30px;
  margin: 40px;
}

/* ------------------------------------------------------------------------- */
</style>