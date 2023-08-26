import { useMutation } from "@tanstack/vue-query"
import { call } from "../services/call"

export const useCall = () => {

  const { 
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    data,
  } = useMutation({
    mutationKey: ['reflection'],
    mutationFn: call,
  })

  return {
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    data,
  }
}