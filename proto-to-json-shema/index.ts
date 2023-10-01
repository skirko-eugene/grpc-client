
import { ReflectionDescriptor, Message, Service, Method, TypeEnum, EnumType, MethodName, } from 'types/reflection'
import * as create from './creations'

export function createSchemaLink(name: string, namespace: string) {
  return `http://${namespace}/${name}`
}

const RegexpLastWord = /\.\w+$/i

export function getNamespace(path: string) {
  return path.replace(RegexpLastWord, '')
}

export type MapSchemaToJSONType = {
  schema: create.Schema[]
  methods: MappedMethod[]
}

export function mapSchemaToJSON(global: ReflectionDescriptor): MapSchemaToJSONType {
  const [types, services] = filterMessageAndEnum(global)

  const namespace = getNamespace(types[0][0])

  const schema: create.Schema[] = types
    .map(([name, item]) => {
      const data = getSchemaObject(item, namespace)
      if (!data) {
        return
      }
      const a: create.Schema = {
        uri: createSchemaLink(item.type.name, namespace),
        schema: data,
      }
      return a
    })
    .filter((item): item is create.Schema => !!item)

  if (services.length !== 1) {
    throw new Error(`Сервисов больше одного, что странно: ` + services.map(item => item[0]))
  }

  const [service] = services

  const methods = Object.entries(service[1])
    .map(item => mapMethod(item, namespace))

  return {
    schema,
    methods,
  }
}

export interface MappedMethod {
  name: MethodName;
  requestType: string;
  responseType: string;
  isRequestStream: boolean;
  isResponseStream: boolean;
  requestURI: string;
  responseURI: string;
}

function mapMethod([name, method]:[MethodName, Method], namespace: string): MappedMethod {
  const {
    requestStream,
    responseStream,
    requestType: {
      type: {
        name: reqTypeName,
      }
    },
    responseType: {
      type: {
        name: resTypeName,
      }
    }
  } = method
  return {
    name: name,
    requestType: reqTypeName,
    responseType: resTypeName,
    isRequestStream: requestStream,
    isResponseStream: responseStream,
    requestURI: createSchemaLink(reqTypeName, namespace),
    responseURI: createSchemaLink(resTypeName, namespace),
  }
}

function getSchemaObject(item: Message | EnumType, namespace: string): create.SchemaEnum | create.SchemaObject {
  if ('value' in item.type) {
    return create.createEnum(item.type.value.map(item => item.name))
  } else if ('field' in item.type) {
    const obj: create.SchemaObject['properties'] = {}
    const { field } = item.type

    return create.createObject(
      field.reduce((acc, item) => {
          switch (item.type) {
            case TypeEnum.TypeString:
              acc[item.name] = create.createString()
              break;
            case TypeEnum.TypeInt32:
            case TypeEnum.TypeSint32:
            case TypeEnum.TypeUint32:
            case TypeEnum.TypeInt64:
            case TypeEnum.TypeSint64:
            case TypeEnum.TypeUint64:
              acc[item.name] = create.createInt()
              break;

            case TypeEnum.TypeFixed32:
            case TypeEnum.TypeFixed64:
            case TypeEnum.TypeSFixed32:
            case TypeEnum.TypeSFixed64:
            case TypeEnum.TypeDouble:
            case TypeEnum.TypeFloat:
              acc[item.name] = create.createNumber()

            case TypeEnum.TypeBoolean:
              acc[item.name] = create.createBoolean()
              break;

            case TypeEnum.TypeBytes:
              acc[item.name] = create.createArray({
                type: 'array',
                items: create.createNumber()
              })
              break;
          
            case TypeEnum.TypeEnum:
            case TypeEnum.TypeMessage:
              acc[item.name] = create.createRef(createSchemaLink(item.typeName, namespace))
              break;

            default:
              console.log(item)
              throw new Error('Нет типа')
        }
        return acc
      }, obj),
      []
    )
  }
  throw new Error('qweqweqweq')
}

function filterMessageAndEnum(global: ReflectionDescriptor) {
  const entries = Object.entries(global)
  const messagesAndEnumsEntries: [string, (Message | EnumType)][] = []

  const servicesEntries: [string, Service][] = []

  entries.forEach((el) => {
    const [, item] = el
    if (item.type && ('name' in item.type || 'value' in item.type)) {
      messagesAndEnumsEntries.push(el as [string, Message | EnumType]);
      return
    }
    servicesEntries.push(el as [string, Service])
  })

  return [
    messagesAndEnumsEntries,
    servicesEntries,
  ] as const
}
