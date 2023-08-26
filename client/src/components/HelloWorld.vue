<script setup lang="ts">
import { Ref, ref, computed } from 'vue'

import { useReflection } from '../hooks/useReflection'
import { useDescriptor } from '../hooks/useDescriptor'
import { useCall } from '../hooks/useCall'


const host = ref('')

const {
  data,
  isLoading,
  mutateAsync,
} = useReflection()

function onHost(){
  mutateAsync([host.value]);
}


const service = ref('')

function selectService(serviceName: string) {
  service.value = serviceName
}

const serviceParams = computed(() => {
  return {
    host: host.value,
    service: service.value,
  }
})

const {
  isLoading: dIsLoading,
  data: dData,
} = useDescriptor(serviceParams)

function getServiceMethods(data: any){
  console.log(data)
  const service = Object.entries(data)
    ?.find(([key, obj]) => {
      if (!obj['format']) {
        return obj
      }
    })

  if (!service) {
    return []
  }
  const [name, obj] = service
  return Object.keys(obj)
}


const {
  isLoading: callIsLoading,
  data: callData,
  mutateAsync: callMutateAsync,
} = useCall()


const method = ref('')
const params = ref('')

function onCall(){
  callMutateAsync({host: host.value, service: service.value, method: method.value, params: params.value})
}

</script>

<template>
  <form @submit.prevent="onHost">
    <input v-model="host"/>
    <button>Отправить</button>
  </form>

  <div v-for="host in data">
    <h2>{{host.host}}</h2>
    <ul>
      <li v-for="item in host.services" @click="selectService(item)">{{ item }}</li>
    </ul>
  </div>

  <template v-if="dData">
    {{ dData }}
    <div v-for="item in dData">
      <h2>Service {{ item.service }}</h2>
      <div>
        <div v-for="methodData in getServiceMethods(item.def)">
          <input type="radio" v-model="method" :value="methodData"/>{{ methodData }}</div>
      </div>
    </div>
  
    <textarea v-model="params"/>
  
    <button @click="onCall">Отправить</button>
  
    {{ callData }}
  </template>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
