import { useLocalStorage } from '@vueuse/core'
import { computed, watch } from 'vue'

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
  const activeTab = useLocalStorage<string>(
    'activeTab',
    '',
  )

  const tabsData = useLocalStorage<TabsData>(
    'tabsData',
    [],
  )

  function del(id: string) {
    const index = tabsData.value.findIndex(item => item.id === id)
    tabsData.value.splice(index, 1)
    if (id === activeTab.value) {
      activeTab.value = ''
    }
  }

  function create(){
    const newItem = {
      id: 'tab' + Date.now(),
      title: 'Новый таб' + ' ' + tabsData.value.length,
      host: '',
      service: '',
      method: '',
      params: '',
      result: '',
    }
    activeTab.value = newItem.id
    tabsData.value.push(newItem)
  }

  watch(tabsData, tabs => {
    if (!activeTab.value) {
      if (tabs[0]?.id) {
        activeTab.value = tabs[0].id
      }
    }
  }, {
    immediate: true,
  })

  return {
    activeTab,
    tabsData,
    del,
    create,
  }
}