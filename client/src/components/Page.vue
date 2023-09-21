<template>
  <div>
    <Tabs
      v-model="activeTabID"
      :tabs="tabs"
      @create="create"
      @close="del($event)"
    />
    <TopBar :host="activeTab?.host" @host="onHost" :isLoading="isReflectionLoading" :fetch-error="reflectionError"/>
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
    <OutputForm :result="activeTab.result"/>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTabs, } from '../hooks/useTabs'
import { useReflection2 } from '../hooks/useReflection';
import { useDescriptor } from '../hooks/useDescriptor';
import { useServiceMethods } from '../hooks/useServiceMethods';
import Tabs from './Tabs.vue'
import TopBar from './TopBar.vue';
import InputForm, { SelectionItem, SelectedModel } from './InputForm.vue';
import OutputForm from './OutputForm.vue';
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

watch(SelectedMethod, SelectedMethod => {
  Object.assign(activeTab.value, SelectedMethod)
})

function onHost(host: string) {
  activeTab.value.host = host
}

const {
  data: reflectionData,
  isLoading: isReflectionLoading,
  // isFetching: isReflectionFetching,
  error: reflectionError
} = useReflection2(
  computed(() => tabs.value.map(item => item.host))
)

const hostReflectionData = computed(() => {
  return reflectionData.value?.find((service) => service.host === activeTab.value.host)
})

const descriptorParams = computed(() => {
  if (!hostReflectionData.value) {
    return
  }

  const {
    host,
    services,
    error,
  } = hostReflectionData.value

  if (typeof error === "string") {
    return
  }

  return {
    host,
    services,
  }
})

const {
  data: descriptorData,
} = useDescriptor(descriptorParams)

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


watch(activeTab, activeTab => {
  if (activeTab && activeTab.service && activeTab.method) {
    SelectedMethod.value = {
      service: activeTab.service,
      method: activeTab.method
    }
  } else if (servicesAndMethods.value) {
    SelectedMethod.value = {
      service: servicesAndMethods.value[0].service,
      method: servicesAndMethods.value[0].methods[0]
    }
  }
}, {
  immediate: true
})


const {
  // isLoading: callIsLoading,
  mutateAsync: callMutateAsync,
} = useCall()

async function onSubmitParams(params: string) {
  activeTab.value.params = params

  const {
    host,
    service,
    method,
  } = activeTab.value
 
  if (!(host && service && method && params)) {
    return
  }

  const result = await callMutateAsync({
    host,
    service,
    method,
    params: JSON.parse(params),
  })

  activeTab.value.result = result
}

const filepath = computed(() => {
  return 'file:///jsons/input/' + activeTab.value.id
})
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
        fileMatch: [filepath.value]
      }
    }

    return item
  })
})

</script>

<style scoped>
</style>