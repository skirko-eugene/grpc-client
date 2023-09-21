import { useMutation, useQuery } from "@tanstack/vue-query"
import { reflection } from "../services/reflection"
import { Ref, watch } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { ServerReflectionResponse } from "types"

export const useReflection = () => {

  const { 
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    data,
  } = useMutation({
    mutationKey: ['reflection'],
    mutationFn: reflection,
  })

  return {
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    data,
  }
}

export const useReflection2 = (hosts: Ref<string[]>) => {
  const storage = useLocalStorage<ServerReflectionResponse>('reflections', [])

  const { 
    isLoading,
    isSuccess,
    data,
    error,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['reflection', hosts],
    queryFn: () => reflection(hosts.value),
    refetchInterval: 3000,
  })

  watch(data, data => {
    storage.value = data
  })

  return {
    isLoading,
    isSuccess,
    data: storage,
    error: error as Ref<Error>,
    isError,
    isFetching,
  }
}