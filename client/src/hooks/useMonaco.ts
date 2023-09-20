import * as monaco from 'monaco-editor'
import { Schema } from 'proto-to-json-shema/creations'
import {watch, Ref, ref, shallowRef, onUnmounted, computed, MaybeRef, unref} from 'vue'

interface Props {
  defaultValue?: string
  readonly?: boolean
  minimap?: boolean
  contextmenu?: boolean
  filepath: string
}

export const useEditor = (schema: Ref<Schema[] | undefined>, options: MaybeRef<Props>) => {
  const el = ref<HTMLElement>()
  const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  
  watch(schema, (schema) => {
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

  watch(() => unref(options), (opts, oldOpts) => {
    if (oldOpts.filepath !== opts.filepath) {
      const uri = monaco.Uri.parse(opts.filepath)

      const models = monaco.editor.getModels().map(item => item.uri.toString())
      if (models.includes(uri.toString())) {
        monaco.editor.getModels().forEach(model => model.dispose());
      }
      
      const model = monaco.editor.createModel(opts.defaultValue ?? '', 'json', uri)
      editor.value?.setModel(model)
    }
  })


  watch(el, async (el) => {
    if (!el) {
      return
    }

    const opts = unref(options)
    const uri = monaco.Uri.parse(opts.filepath)

    monaco.editor.getModels().forEach(model => model.dispose());
    const model = monaco.editor.createModel(opts.defaultValue ?? '', 'json', uri)

    editor.value = monaco.editor.create(el, {
      model,
      theme: theme.value,
      readOnly: opts.readonly,
      minimap: {
        enabled: opts.minimap,
      },
      contextmenu: opts.contextmenu,
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