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
    (q) => {
      const [, data] = q.queryKey
      return descriptor(data)
    },
    {
      enabled: isEnabled
    }
  )

  const parsedData = computed(() => {
    return data.value ? data.value.map((item: string) => {
      return {
        // @ts-ignore
        service: item.service,
        // @ts-ignore
        def: JSON.parse(item.definition),
      }
    }) : undefined
  })

  return {
    isLoading,
    isSuccess,
    data: parsedData,
  }
}