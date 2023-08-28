import * as monaco from 'monaco-editor'
import {watch, Ref, ref, shallowRef,} from 'vue'

export const useEditor = (el: Ref<HTMLElement | undefined>) => {
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const schema = ref<unknown>({
    type: "object",
    properties: {
      name: {
        type: "string"
      },
      age: {
        type: "number"
      },
      email: {
        type: "string",
        format: "email"
      }
    }
  })

  watch(schema, (schema, o) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      // @ts-ignore
      schemas: [{
        fileMatch: ["*"],
        schema: JSON.parse(JSON.stringify(schema))
      }]
    });

    editor.value?.updateOptions({})
  }, {
    immediate: true,
  })

  watch(el, async (el) => {
    if (!el) {
      return
    }

    editor.value = monaco.editor.create(el, {
      language: 'json',
      value: '{\n\t\n}'
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