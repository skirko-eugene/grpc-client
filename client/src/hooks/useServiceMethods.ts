import { Ref, computed } from "vue";
import { Res } from '../services/descriptor'
import { MethodsList, ReflectionDescriptor } from 'types/reflection'
import {
  mapSchemaToJSON,
} from 'proto-to-json-shema'

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
        methods: Object.entries(service[1]),
        schema: mapSchemaToJSON(item.definition)
      }
    })

    return services
  })

  return result
}
