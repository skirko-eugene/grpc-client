<template>
  <div class="topSection">
    <div class="topSection__selectHost">
      <InputHost
        :host="host"
        :isLoading="isLoading"
        :fetchError="fetchError"
        @host="onHost"
      />
    </div>
    <div class="topSection__select">
      <InputSelect
        placeholder="Выберите Сервис"
        v-model="selectPeople02"
        :items="people"
      />
      <InputSelect
        placeholder="Выберите Метод"
        v-model="selectPeople03"
        :items="people"
      />
    </div>
    <InputButton>Send</InputButton>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { type TopSectionProps } from './interfaces';
import InputSelect from "../InputSelect";
import InputButton from "../InputButton";
import InputHost from '../InputHost';

const props = defineProps<TopSectionProps>();

const emit = defineEmits<{
  host: [string],
}>();

const onHost = (item: string) => {
  emit('host', item);
}

const people = [
  { id: 1, value: 'Durward Reynolds', disabled: false },
  { id: 2, value: 'Kenton Towne', disabled: false },
  { id: 3, value: 'Therese Wunsch', disabled: false },
  { id: 4, value: 'Benedict Kessler', disabled: true },
  { id: 5, value: 'Katelyn Rohan', disabled: false },
]

const selectPeople02 = ref();
const selectPeople03 = ref();

</script>
<style lang="postcss">
/* ------------------------------------------------------------------------- */

.topSection {
  display: flex;
  margin: 40px;
}

.topSection__selectHost {
  margin-right: 8px;
}

.topSection__select {
  display: flex;
  width: 100%;
  min-width: 300px;
  max-width: 600px;
  margin-right: 8px;
  & .inputSelect {
    width: 50%;
    &:first-child {
      & .inputSelect__button {
        border-radius: 4px 0 0 4px;
        border-right: 0;
      }
    }
    &:last-child {
      & .inputSelect__button {
        border-radius: 0 4px 4px 0;
        /* border-left: 0; */
      }
    }
  }
  & .inputSelect__button {
    border-radius: 0;
  }
}

/* ------------------------------------------------------------------------- */
</style>../InputSelect