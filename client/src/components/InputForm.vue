<template>
  <div class="InputForm">
    <select class="InputForm__method-picker" v-model="inputSelectValue">
      <optgroup v-for="item in services" :label="item.service">
        <option v-for="method in item.methods" :value="{service: item.service, method}">{{ method }}</option>
      </optgroup>
    </select>
  
    <div
      v-if="selected.method"
      ref="editorContainer"
      class="InputForm__editor"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { KeyCode, KeyMod } from 'monaco-editor'
import { useEditor } from '../hooks/useMonaco';

export interface SelectedModel {
  service: string;
  method: string;
}

export type SelectionItem = { service: string, methods: string[] }

interface Props {
  selected: SelectedModel
  services: SelectionItem[]
  paramsValue: string
  jsonSchema: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selected': [SelectedModel]
  'update:paramsValue': [string]
}>()

const inputSelectValue = computed({
  get(){
    return props.selected
  },
  set(val){
    emit('update:selected', val)
  }
})

const editorContainer = ref<HTMLElement>()
const {
  editor,
} = useEditor(editorContainer, {
  defaultValue: props.paramsValue || '{\n\t\n}',
  contextmenu: false,
  minimap: false,
  schema: computed(() => props.jsonSchema)
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