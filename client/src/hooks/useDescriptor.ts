import { useQuery } from "@tanstack/vue-query"
import { descriptor } from "../services/descriptor"
import { Ref, computed } from "vue"

type ArgType<T> = T extends (arg: infer R) => any ? R : never

export const useDescriptor = (value: Ref<ArgType<typeof descriptor> | undefined>) => {
  const isEnabled = computed(() => {
    if (!value.value) {
      return false
    }
    if ('service' in value.value) {
      return Boolean(value.value.host && value.value.service)
    } else {
      return Boolean(value.value.host && value.value.services.length)
    }
  })

  const { 
    isLoading,
    isSuccess,
    data,
  } = useQuery(
    ['descriptor', value],
    () => {
      return descriptor(value.value!)
    },
    {
      enabled: isEnabled
    }
  )

  return {
    isLoading,
    isSuccess,
    data: computed(() => {
      return data.value?.filter(item => {
        return item.service !== 'grpc.reflection.v1alpha.ServerReflection'
      })
    }),
  }
}