import { useQuery } from "@tanstack/vue-query"
import { descriptor } from "../services/descriptor"
import { Ref, computed } from "vue"

type ArgType<T> = T extends (arg: infer R) => any ? R : never

export const useDescriptor = (value: Ref<ArgType<typeof descriptor>>) => {
  const isEnabled = computed(() => Boolean(value.value.host && value.value.service))

  const { 
    isLoading,
    isSuccess,
    data,
  } = useQuery(
    ['descriptor', value],
    () => {
      return descriptor(value.value)
    },
    {
      enabled: isEnabled
    }
  )

  return {
    isLoading,
    isSuccess,
    data,
  }
}