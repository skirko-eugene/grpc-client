import { Ref, computed } from "vue";
import { MethodsList, ReflectionDescriptor, Res } from '../services/descriptor'

export const useServiceMethods = (data: Ref<Res<ReflectionDescriptor>[] | undefined>) => {
  const result = computed(() => {

    const services = data.value?.map(item => {
      // Если нету поля формат, то это сервис
      const service = Object.entries(item.definition)
        .find(([,value]) => !('format' in value)) as [string, MethodsList] | null

      if (!service) {
        return;
      }

      return {
        ...item,
        methods: Object.entries(service[1])
      }
    })



    return services
  })

  return result
}
