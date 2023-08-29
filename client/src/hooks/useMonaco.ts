import * as monaco from 'monaco-editor'
import {watch, Ref, ref, shallowRef,} from 'vue'

let counter = 0
// @ts-ignore
window.monaco = monaco

export const useEditor = (el: Ref<HTMLElement | undefined>) => {
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const schema = ref<unknown>()
  const uri = monaco.Uri.parse(`a://input${counter++}.json`)

  watch(schema, (schema) => {
    if (!schema) {
      return
    }
    const isUpdate = monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas?.find(item => {
      return item.fileMatch?.[0] === uri.toString()
    })

    const item = {
      uri: '',
      fileMatch: ['*'],
      schema: JSON.parse(JSON.stringify(schema))
    }

    if (isUpdate) {
      monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas!.splice(
        monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas!.indexOf(isUpdate),
        1,
        item
      )

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas,
      })

    } else {
      const schema = monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas ? 
        (monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas.push(item), monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas):
        [item]

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: schema
      })
    }

  }, {
    immediate: true,
  })

  watch(el, async (el) => {
    if (!el) {
      return
    }
    debugger
    editor.value = monaco.editor.create(el, {
      language: 'json',
      value: '{\n\t\n}',
      
      // model: monaco.editor.createModel('{\n\t\n}', "json", uri)
    });

    return () => {
      editor.value?.dispose();
    }
  }, {
    immediate: true,
  })

  return {
    editor,
    schema,
    value: function getValue() {
      const ed = editor.value
      
      return ed?.getValue();
    }
  }
}