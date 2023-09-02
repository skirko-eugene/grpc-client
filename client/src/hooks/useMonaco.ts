import * as monaco from 'monaco-editor'
import {watch, Ref, ref, shallowRef, onUnmounted, computed, MaybeRef,} from 'vue'

let counter = 0
// @ts-ignore
window.monaco = monaco

interface Props {
  defaultValue?: string
  readonly?: boolean
  minimap?: boolean
  contextmenu?: boolean
  schema: MaybeRef<any>
}

export const useEditor = (el: Ref<HTMLElement | undefined>, options?: Props) => {
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const schema = options?.schema ?? {}
  const name = `input${counter++}.json`
  const uri = monaco.Uri.parse(`file:///jsons/${name}`)

  console.log(schema);
  
  watch(schema, (schema) => {
    console.log(schema, '====');
    
    if (!schema) {
      return
    }
    const isUpdate = monaco.languages.json.jsonDefaults.diagnosticsOptions.schemas?.find(item => {
      return item.fileMatch?.[0] === uri.toString()
    })

    const item = {
      uri: uri.toString() + 'schema',
      fileMatch: [name],
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
        schemaValidation: 'error',
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


  const event = window.matchMedia('(prefers-color-scheme: dark)')

  const theme = ref<'vs-dark' | 'vs'>('vs')
  const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
    theme.value = event.matches ? 'vs-dark' : 'vs';
  }
  onChange(event)
  event.addEventListener('change', onChange);

  onUnmounted(() => {
    event.removeEventListener('change', onChange);
  })

  watch(theme, data => {
    monaco.editor.setTheme(data)
  })


  watch(el, async (el) => {
    if (!el) {
      return
    }
    const model = monaco.editor.createModel(options?.defaultValue ?? '', 'json', uri)

    editor.value = monaco.editor.create(el, {
      model,
      theme: theme.value,
      readOnly: options?.readonly,
      minimap: {
        enabled: options?.minimap,
      },
      contextmenu: options?.contextmenu,
    });

    return () => {
      editor.value?.dispose();
    }
  }, {
    immediate: true,
  })

  const value = computed<string>({
    get(){
      const ed = editor.value
      
      return ed?.getValue() ?? '';
    },
    set(val: string){
      const ed = editor.value
      
      return ed?.setValue(val)
    }
  })

  return {
    editor,
    schema,
    value,
  }
}