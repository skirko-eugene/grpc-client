<template>
  <button
    class="inputButton"
    type="button"
  ><slot></slot></button>
</template>
<script lang="ts" setup>

</script>
<style lang="postcss">
/* ------------------------------------------------------------------------- */

.inputButton {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  border: 0;
  padding: 0 20px;
  border-radius: var(--radius-s);
  color: rgb(var(--brown01));
  font-family: var(--boldFont);
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
  background-color: rgb(var(--yellow01));
  cursor: pointer;
}

/* ------------------------------------------------------------------------- */
</style>