import { useLocalStorage } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'

export type Host = string & {}
export type ServiceName = string & {}
export type MethodName = string & {}


export type TabData = {
  id: string
  title: string
  host: Host
  service: ServiceName
  method: MethodName
  params: string
  result: string
}

type TabsData = TabData[]

export function useTabs() {
  const activeTabID = useLocalStorage<string>(
    'activeTabID',
    '',
  )

  const tabsData = useLocalStorage<TabsData>(
    'tabsData',
    [],
    {
      deep: true,
    }
  )

  if (!tabsData.value.length) {
    create();
  }
  if (!activeTabID.value) {
    activeTabID.value = tabsData.value[0].id
  }

  const activeTab = computed(() => {
    return tabsData.value.find(tab => tab.id === activeTabID.value)!
  })

  function del(id: string) {
    if (tabsData.value.length === 1) {
      return
    }

    const index = tabsData.value.findIndex(item => item.id === id)
    
    if (id === activeTabID.value) {
      if (index === 0) {
        activeTabID.value = tabsData.value[1].id
      } else {
        activeTabID.value = tabsData.value[index - 1].id
      }
    }
    
    tabsData.value.splice(index, 1)
    
  }

  function create(){
    const {
      length,
      [length - 1]: lastTab,
    } = tabsData.value

    const newItem = {
      id: 'tab' + Date.now(),
      title: 'Новый таб' + ' ' + tabsData.value.length,
      host: lastTab.host,
      service: '',
      method: '',
      params: '',
      result: '',
    }

    tabsData.value.push(newItem)
    activeTabID.value = newItem.id
  }

  return {
    activeTabID,
    activeTab,
    tabsData,
    del,
    create,
  }
}