<template>
  <div class="InputForm">
    <select class="InputForm__method-picker" v-model="inputSelectValue">
      <optgroup v-for="item in services" :label="item.service">
        <option v-for="method in item.methods" :value="item.service + ':' + method">{{ method }}</option>
      </optgroup>
    </select>
  
    <div
      v-if="selected.method"
      ref="el"
      class="InputForm__editor"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { KeyCode, KeyMod } from 'monaco-editor'
import { useEditor } from '../hooks/useMonaco';
import { Schema } from 'proto-to-json-shema/creations';

export interface SelectedModel {
  service: string;
  method: string;
}

export type SelectionItem = { service: string, methods: string[] }

interface Props {
  selected: SelectedModel
  services: SelectionItem[]
  paramsValue: string
  jsonSchema?: Schema[]
  filepath: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selected': [SelectedModel]
  'update:paramsValue': [string]
}>()

const inputSelectValue = computed({
  get(){
    return props.selected.service + ':' + props.selected.method
  },
  set(val){
    const [service, method] = val.split(':')

    const newValue: SelectedModel = {
      service,
      method,
    }

    emit('update:selected', newValue)
  }
})

const jsonSchema = computed(() => props.jsonSchema)

const {
  el,
  editor,
  value,
} = useEditor(
  jsonSchema,
  computed(() => ({
    defaultValue: getValue(props.paramsValue),
    contextmenu: false,
    minimap: false,
    filepath: props.filepath,
  }))
)

watch(() => props.filepath, () => {
  value.value = getValue(props.paramsValue)
})

watch(editor, item => {
  if (!item) {
    return
  }
  
  item.addAction({
    id: "executeCurrentAndAdvance",
    label: "Execute Block and Advance",
    keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
    contextMenuGroupId: "2_execution",
    run: (editor) => {
      emit('update:paramsValue', editor.getValue())
    },
  })
})

function getValue(val: string){
  return val || '{\n\t\n}'
}

</script>

<style scoped>
.InputForm {
  height: 400px;
  position: relative;
}

.InputForm__editor {
  height: 100%;
}

.InputForm__method-picker {
  position: absolute;
  right: 20px;
  top: 1em;
  z-index: 99;
}
</style>