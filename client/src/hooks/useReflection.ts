import { useMutation } from "@tanstack/vue-query"
import { reflection } from "../services/reflection"

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