<template>
  <div>{{ result }}</div>
</template>

<script lang="ts" setup>

interface Props {
  result: string;
}

defineProps<Props>()
</script>