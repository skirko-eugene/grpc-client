<script setup lang="ts">
import { ref, computed, watch, onMounted, } from 'vue'

import { useReflection } from '../hooks/useReflection'
import { useDescriptor } from '../hooks/useDescriptor'
import { useCall } from '../hooks/useCall'
import { useEditor } from '../hooks/useMonaco'
import { useServiceMethods } from '../hooks/useServiceMethods'


const host = ref('localhost:50051')

const {
  data,
  // isLoading,
  mutateAsync,
} = useReflection()

function onHost(){
  mutateAsync([host.value]);
}


const service = ref('')

const serviceParams = computed(() => {
  return {
    host: host.value,
    service: service.value,
  }
})

const {
  data: dData,
} = useDescriptor(serviceParams)


const mapped = useServiceMethods(dData)


const {
  // isLoading: callIsLoading,
  data: callData,
  mutateAsync: callMutateAsync,
} = useCall()

const methods = computed(() => {
  return mapped.value
    ?.find(item => item?.service === service.value)
    ?.methods
})

const method = ref('')

const selectedMethodDefinition = computed(() => {
  return methods.value?.find(item => item[0] === method.value);
})

function onCall(){
  callMutateAsync({
    host: host.value,
    service: service.value,
    method: method.value,
    params: JSON.parse(value() ?? '{}'),
  })
}

const el = ref<HTMLElement>()
const {
  value,
  schema,
} = useEditor(el)

watch(selectedMethodDefinition, (def) => {
  if (!def) {
    schema.value = {}
    return
  }

  const [, methodDef] = def

  schema.value = methodDef.requestType.type.field.reduce((acc, item) => {
    acc.properties[item.name] = {
      type: mapType(item.type) || item.typeName
    }

    return acc
  }, {
    type: 'object',
    properties: {}
  } as Record<string, any>)
})

function mapType(type: string,) {
  switch (type) {
    case "TYPE_STRING":
      return 'string'
  
    default:
      break;
  }
}

</script>

<template>
  <form @submit.prevent="onHost">
    <input v-model="host"/>
    <button>Отправить</button>
  </form>

  <div v-for="host in data">
    <h2>Services</h2>

    <div v-if="'services' in host">
      <div v-for="item in host.services">
        <input type="radio" v-model="service" :value="item"/>{{ item }}</div>
    </div>
  </div>

  <template v-if="dData">
    <h2>Methods</h2>
    <div>
      <div v-for="methodData in methods">
        <input type="radio" v-model="method" :value="methodData[0]"/>{{ methodData[0] }}</div>
    </div>
    
    <div
      v-if="method"
      style="width: 600px; height: 300px; text-align: left;"
      ref="el"
    >
    </div>
  
    <button @click="onCall">Отправить</button>
    <div>
      <h4>Ответ</h4>
      {{ callData }}
    </div>
  </template>

</template>

<style scoped>

</style>
