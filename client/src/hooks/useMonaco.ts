import * as monaco from 'monaco-editor'
import { Schema } from 'proto-to-json-shema/creations'
import {watch, Ref, ref, shallowRef, onUnmounted, computed, MaybeRef,} from 'vue'

let counter = 0
// @ts-ignore
window.monaco = monaco

interface Props {
  defaultValue?: string
  readonly?: boolean
  minimap?: boolean
  contextmenu?: boolean
  filepath: string
}

export const useEditor = (schema: Ref<Schema[] | undefined>, options: Props) => {
  const el = ref<HTMLElement>()
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const uri = monaco.Uri.parse(options.filepath)
  
  watch(schema, (schema) => {
    console.log(schema, '====');
    
    if (!schema) {
      return
    }
    
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: schema,
      schemaValidation: 'error',
    })

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
    el,
    editor,
    schema,
    value,
  }
}