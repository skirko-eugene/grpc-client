<template>
  <div>
    <Tabs
      v-model="activeTabID"
      :tabs="tabs"
      @create="create"
      @close="del($event)"
    />
    <TopBar :host="activeTab?.host" @host="onHost"/>
    <InputForm
      v-if="servicesAndMethods && SelectedMethod"
      :selected="SelectedMethod"
      @update:selected="onSelect"

      :services="servicesAndMethods"

      :params-value="activeTab.params"
      @update:params-value="onSubmitParams"

      :json-schema="schema"
      :filepath="filepath"
    />
    <div>{{ callData }}</div>
    <!-- <HelloWorld /> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTabs, } from '../hooks/useTabs'
import { useReflection } from '../hooks/useReflection';
import { useDescriptor } from '../hooks/useDescriptor';
import { ServicesResponse } from 'types';
import { useServiceMethods } from '../hooks/useServiceMethods';
import Tabs from './Tabs.vue'
import TopBar from './TopBar.vue';
import InputForm, { SelectionItem, SelectedModel } from './InputForm.vue';
import { useCall } from '../hooks/useCall';
import { createSchemaLink, getNamespace } from 'proto-to-json-shema';

const {
  tabsData: tabs,
  create,
  del,
  activeTabID,
  activeTab,
} = useTabs()

const SelectedMethod = ref<SelectedModel>()

if (activeTab.value && activeTab.value.service && activeTab.value.method) {
  SelectedMethod.value = {
    service: activeTab.value.service,
    method: activeTab.value.method
  }
}

watch(SelectedMethod, SelectedMethod => {
  Object.assign(activeTab.value, SelectedMethod)
})

function onHost(host: string) {
  activeTab.value.host = host
  mutateAsync([host])
}

const {
  data,
  mutateAsync,
} = useReflection()

if (activeTab.value.host) {
  mutateAsync([activeTab.value.host])
}

const services = computed(() => {
  return data.value?.find((service): service is ServicesResponse => service.host === activeTab.value.host) 
})

const {
  data: descriptorData,
} = useDescriptor(services)

const mapped = useServiceMethods(descriptorData)

const servicesAndMethods = computed(() => {
  return mapped.value
    ?.map<SelectionItem | undefined>(item => {
      if (!item) {
        return
      }

      return {
        service: item.service,
        methods: item.methods.map(([name]) => name)
      }
    })
    .filter((item): item is SelectionItem => !!item)
})

function onSelect(event: SelectedModel) {
  SelectedMethod.value = event
}

watch(servicesAndMethods, (servicesAndMethods) => {
  if (!SelectedMethod.value) {
    if (servicesAndMethods && servicesAndMethods[0]?.methods?.[0]) {
      SelectedMethod.value = {
        service: servicesAndMethods[0].service,
        method: servicesAndMethods[0].methods[0]
      }
    }
  }
})



const {
  // isLoading: callIsLoading,
  data: callData,
  mutateAsync: callMutateAsync,
} = useCall()

function onSubmitParams(params: string) {
  activeTab.value.params = params

  const {
    host,
    service,
    method,
  } = activeTab.value
 
  if (!(host && service && method && params)) {
    return
  }

  callMutateAsync({
    host,
    service,
    method,
    params: JSON.parse(params),
  })
}

const filepath = 'file:///jsons/input'
const schema = computed(() => {
  const {
    service,
    method,
  } = activeTab.value

  const serviceDefinition = mapped.value
    ?.find(item => item?.service === service)

  if (!serviceDefinition) {
    return
  }

  const selectedMethodDefinition = serviceDefinition
    .methods
    .find(([methodName]) => methodName === method)

  if (!selectedMethodDefinition) {
    return
  }

  const namespace = getNamespace(service)

  const [, methodDef] = selectedMethodDefinition

  const link = createSchemaLink(methodDef.requestType.type.name, namespace)

  return serviceDefinition.schema.map(item => {
    if (item.uri === link) {
      return {
        ...item,
        fileMatch: [filepath]
      }
    }

    return item
  })
})

watch(schema, i => console.log(i))

</script>

<style scoped>
</style>