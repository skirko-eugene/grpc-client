<script setup lang="ts">
import { ref, computed, watch, } from 'vue'

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

onHost()

function onHost(){
  if (host.value)
    mutateAsync([host.value]);
}

const hostServices = computed(() => {
  const hostData = data.value?.find(item => host.value === item.host)

  if (!hostData) {
    return null
  }

  return 'services' in hostData ? hostData: null
})

const serviceParams = computed(() => {
  return {
    host: host.value,
    services: hostServices.value?.services ?? []
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

const inputSelectValue = ref('')

const serviceWithMethods = computed(() => {
  return dData.value?.map(service => {
    
    const methods = mapped.value
      ?.find(item => item?.service === service.service)
      ?.methods
    return {
      service: service.service,
      methods
    }
  })
})

watch(serviceWithMethods, (data) => {
  if (!data) {
    return
  }

  if (inputSelectValue.value) {
    return
  }

  if (!data[0]) {
    return 
  }
  if (!data[0].methods) {
    return
  }

  inputSelectValue.value = data[0].service + ':' + data[0].methods[0][0]
})



const service = computed(() => {
  return inputSelectValue.value.split(':')[0]
})
const method = computed(() => {
  return inputSelectValue.value.split(':')[1]
})

const selectedMethodDefinition = computed(() => {
  const serv = serviceWithMethods.value?.find(item => item.service === service.value)
  const metd = serv?.methods?.find(item => item[0] === method.value)

  return metd
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

const el2 = ref<HTMLElement>()
const {
  schema: sservices,
} = useEditor(el2)
sservices.value = {
  type: 'object',
}

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

  <select v-model="inputSelectValue" v-if="data && dData">
    <optgroup v-for="item in serviceWithMethods" :label="item.service">
      <option v-for="method in item.methods" :value="item.service + ':' + method[0]">{{ method[0] }}</option>
    </optgroup>
  </select>

  <template v-if="dData">
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
  <div
    ref="el2"
    style="width: 600px; height: 300px; text-align: left;"
  >

  </div>

</template>

<style scoped>

</style>
