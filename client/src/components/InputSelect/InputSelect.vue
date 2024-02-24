<template>
  <div
    class="inputSelect"
    :class="computedClass"
  >
    <Listbox v-model="selectedPerson">
      <ListboxButton class="inputSelect__button">
        {{ selectedPerson?.value ?? placeholder }}
        <IconChevronDown />
      </ListboxButton>
      <ListboxOptions class="inputSelect__group">
        <ListboxOption
          v-for="item in items"
          :key="item.id"
          :value="item.value"
          :disabled="item.disabled"
          class="inputSelect__item"
        >
          {{ item.value }}
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { type SelectItem } from './interfaces';
import IconChevronDown from '../../icons/IconChevronDown.vue';

const props = defineProps<{
  placeholder?: string,
  modelValue: SelectItem | undefined,
  items: SelectItem[],
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: SelectItem | undefined): void,
}>();

const computedClass = computed(() => {
  return {
    "inputSelect--undefined": !props.modelValue
  }
})


const selectedPerson = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    const selectedValue = props.items.find((item) => item.value == value);
    emits("update:modelValue", selectedValue);
  }
});
</script>
<style lang="postcss">
.inputSelect {
  --dropDownMinWidth: 100%;
  --dropDownMaxWidth: 500px;
  --fontSize: 13px;
  --padding: 12px;
  --borderColor: var(--gray03);
  --backgroundColor: var(--gray02);
  --textColor: var(--gray07);
  --selectColor: 255,255,255;
  --iconChevronColor: var(--gray05);
  position: relative;
}
.inputSelect--undefined {
  & .inputSelect__button {
    color: rgba(var(--textColor), 0.5);
  }
}
.inputSelect__button {
  width: 100%;
  height: 36px;
  overflow: hidden;
  padding: 0 var(--padding);
  margin: 0;
  border: 1px solid rgb(var(--borderColor));
  border-radius: 4px;
  position: relative;
  background-color: rgb(var(--backgroundColor));
  font-family: var(--defaultFont);
  font-size: var(--fontSize);
  white-space: nowrap;
  line-height: 1;
  color: rgb(var(--textColor));
  text-align: left;
  cursor: pointer;
  & svg {
    --color: rgb(var(--iconChevronColor));
    display: block;
    width: 16px;
    height: 16px;
    position: absolute;
    right: var(--padding);
    top: 10px;
    z-index: 1;
    transition: transform 0.2s ease;
  }
  &:after {
    content: '';
    display: block;
    width: 40px;
    height: 100%;
    background: rgb(var(--backgroundColor));
    background: linear-gradient(90deg, rgba(var(--backgroundColor),0) 0%, rgba(var(--backgroundColor),1) 25%, rgba(var(--backgroundColor),1) 100%);
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
  }
}
.inputSelect__button[aria-expanded="true"] {
  & svg {
    transform: rotate(-180deg);
  }

}
.inputSelect__group {
  width: fit-content;
  min-width: var(--dropDownMinWidth);
  max-width: var(--dropDownMaxWidth);
  /* max-height: 200px; */
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
  border: 1px solid rgb(var(--borderColor));
  border-radius: 4px;
  background-color: rgb(var(--backgroundColor));
  overflow: hidden;
  overflow-y: auto;
  position: absolute;
  z-index: 100;
}
.inputSelect__item {
  border-bottom: 1px solid rgb(var(--borderColor));
  padding: 10px var(--padding);
  color: rgb(var(--textColor));
  font-size: var(--fontSize);
  line-height: 1.2;
  cursor: pointer;
  &:last-child {
    border-bottom: 0;
  }
  &[data-headlessui-state="selected"] {
    font-family: var(--mediumFont);
    color: rgb(var(--selectColor));
    background-color: rgb(var(--borderColor));
    cursor: default;
  }
  &[data-headlessui-state="active"] {
    background-color: rgb(var(--borderColor));
  }
  &[data-headlessui-state="active selected"] {
    font-family: var(--mediumFont);
    color: rgb(var(--selectColor));
    background-color: rgb(var(--borderColor));
    cursor: default;
  }
  &[data-headlessui-state="disabled"] {
    color: rgba(var(--textColor), 0.4);
    cursor: not-allowed;
  }
}
</style>