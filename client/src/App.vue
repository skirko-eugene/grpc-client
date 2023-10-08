<template>
  <TabsBlock
    v-model="activeTabID"
    :tabs="tabs"
    @create="create"
    @close="del($event)"
  />
  <TopSection
    :host="activeTab?.host"
    :isLoading="isReflectionLoading"
    :fetchError="reflectionError"
    @host="onHost"
  />
  <div class="mainSection">
    <InputForm
      v-if="servicesAndMethods && SelectedMethod"
      :selected="SelectedMethod"
      :services="servicesAndMethods"
      :params-value="activeTab.params"
      :json-schema="schema"
      :filepath="filepath"
      @update:selected="onSelect"
      @update:params-value="onSubmitParams"
    />
    <OutputForm
      :result="activeTab.result"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTabs, } from './hooks/useTabs'
import { useReflection2 } from './hooks/useReflection';
import { useDescriptor } from './hooks/useDescriptor';
import TabsBlock from './components/TabsBlock';
import TopSection from './components/TopSection';
import InputForm, { SelectionItem, SelectedModel } from './components/InputForm.vue';
import OutputForm from './components/OutputForm.vue';
import { useCall } from './hooks/useCall';

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

const servicesAndMethods = computed(() => {
  
  return descriptorData.value
    ?.map<SelectionItem | undefined>(item => {
      if (!item) {
        return
      }

      if (!item.definition.methods) {
        debugger
      }

      return {
        service: item.service,
        methods: item.definition.methods.map((item) => item.name)
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

  const serviceDefinition = descriptorData.value
    ?.find(item => item?.service === service)

  if (!serviceDefinition) {
    return
  }

  const selectedMethodDefinition = serviceDefinition
    .definition.methods
    .find(({name}) => name === method)

  if (!selectedMethodDefinition) {
    return
  }

  const { requestURI } = selectedMethodDefinition

  const finalSchema = descriptorData.value?.[0].definition.schema.map(item => {
    if (item.uri === requestURI) {
      return {
        ...item,
        fileMatch: [filepath.value]
      }
    }

    return item
  }) ?? [];

  // обрезаем ссылочность, а то не удается передать через postMessage из-за какой-то ссылочной связи
  return JSON.parse(JSON.stringify(finalSchema))
})

</script>

<style lang="postcss">
@import "./assets/css/common.css";

.Page__tabs {
  grid-area: tabs;
}
.PageTopSection {
  grid-area: top;
  margin: 40px;
}
.Page__inputForm {
  grid-area: left;
  margin-left: 40px;
}
.Page__outputForm {
  grid-area: right;
  margin-right: 40px;
}

.mainSection {
  width: 100%;
  display: flex;
  gap: 20px;
  padding-left: 40px;
  padding-right: 40px;
  & .InputForm {
    width: 50%;
  }
  & .qwe {
    width: 50%;
  }
}

</style>