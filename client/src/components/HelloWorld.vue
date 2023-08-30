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
    params: JSON.parse(value.value ?? '{}'),
  })
}

const el = ref<HTMLElement>()
const {
  value,
  schema,
} = useEditor(el, {
  defaultValue: '{\n\t\n}'
})

const el2 = ref<HTMLElement>()
const {
  schema: sservices,
  value: svalue,
} = useEditor(el2, {
  readonly: true,
})

sservices.value = {
  type: 'object',
}

watch(callData, data => {
  svalue.value = JSON.stringify(data, null, 2)
})

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
  <div class="page">

    <div class="halfPage">
      <form @submit.prevent="onHost">
        <input type="text" v-model="host"/>
        <button>Получить</button>
      </form>
    
      <select v-model="inputSelectValue" v-if="data && dData">
        <optgroup v-for="item in serviceWithMethods" :label="item.service">
          <option v-for="method in item.methods" :value="item.service + ':' + method[0]">{{ method[0] }}</option>
        </optgroup>
      </select>
    
      <template v-if="dData">
        <div
          v-if="method"
          style="width: 100%; height: 300px;"
          ref="el"
        >
        </div>
      
        <button @click="onCall">Отправить</button>
    
      </template>
    </div>
    <div
      ref="el2"
      class="halfPage"
    >
  
    </div>
  </div>

</template>

<style scoped>
.page {
  display: flex;
  border-top: 12px solid #333;
}
.halfPage {
  width: 50%;
  height: 100vh;
}
form {
  width: 100%;
  background: #333;
  
  display: flex;
  align-items: center;
}

input[type="text"] {
  flex-grow: 1;
  border: none;
  /* border: 1px solid red; */
  border-radius: 3px;
  box-sizing: border-box;
  margin: 6px 8px;
  padding: 4px 20px;
  color: #aaa;

  box-shadow: none;

  font: inherit;
  font-size: 15px;
}
input[type="text"]:focus {
  color: #fff;
}

form button {
  padding: 0px 10px;
  margin: 3px 8px 3px 0;
  height: 32px;
  border-radius: 3px;
}

</style>
