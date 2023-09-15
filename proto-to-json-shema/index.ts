
import { ReflectionDescriptor, Message, Field, TypeEnum, EnumType, } from 'types/reflection'
import * as create from './creations'

export function createSchemaLink(name: string, namespace: string) {
  return `http://${namespace}/${name}`
}

export function getNamespace(path: string) {
  return path.replace(/\.\w+$/i, '')
}

export function mapSchemaToJSON(global: ReflectionDescriptor): create.Schema[] {
  const types = filterMessageAndEnum(global)

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

  return schema
}

function getSchemaObject(item: Message | EnumType, namespace: string): create.SchemaEnum | create.SchemaObject {
  if ('value' in item.type) {
    return create.createEnum(item.type.value.map(item => item.name))
  } else if ('field' in item.type) {
    const obj: create.SchemaObject['properties'] = {}
    const { field } = item.type

    return create.createObject(
      field.reduce((acc, item) => {
        if ([TypeEnum.TypeString, TypeEnum.TypeInt32, TypeEnum.TypeInt64].includes(item.type)) {
          switch (item.type) {
            case TypeEnum.TypeString:
              acc[item.name] = create.createString()
              break;
            case TypeEnum.TypeInt32:
            case TypeEnum.TypeInt64:
              acc[item.name] = create.createInt()
              break;
          
            default:
              throw new Error('Нет типа')
          }
        } else {
          switch (item.type) {
            case TypeEnum.TypeEnum:
            case TypeEnum.TypeMessage:
              acc[item.name] = create.createRef(createSchemaLink(item.typeName, namespace))
              break;

            default:
              console.log(item)
              throw new Error('Нет типа')
          }
        }
        return acc
      }, obj),
      []
    )
  }
  throw new Error('qweqweqweq')
}

function filterMessageAndEnum(global: ReflectionDescriptor) {
  return Object.entries(global).filter((el): el is [string, EnumType | Message] => {
    const [, item] = el
    if (item.type && ('name' in item.type || 'value' in item.type)) {
      return true
    }
    return false
  })
}