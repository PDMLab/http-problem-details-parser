import { ProblemDocument, ProblemDocumentExtension } from 'http-problem-details'

export type ProblemObject = {
  status: number
  title: string
  detail?: string
  type: string
  instance?: string
} & Record<string, unknown>

export const fromObject = (
  object: ProblemObject,
  mappers?: HttpProblemExtensionMapper[]
): ProblemDocument => {
  const { status, title, detail, type, instance } = object
  const document = new ProblemDocument({
    status,
    title,
    detail,
    type,
    instance
  })
  return mappers ? mapExtensions(object, document, mappers) : document
}

export const fromJSON = (
  json: string,
  extensionMappers?: HttpProblemExtensionMapper[]
): ProblemDocument => fromObject(JSON.parse(json), extensionMappers)

export type HttpProblemExtensionMapper = {
  type: string
  map: (object: Record<string, unknown>) => ProblemDocumentExtension
}

export const mapExtensions = (
  object: Record<string, unknown>,
  document: ProblemDocument,
  mappers: HttpProblemExtensionMapper[]
): ProblemDocument => {
  const mapper = mappers.find(
    (m: HttpProblemExtensionMapper): boolean => m.type === document.type
  )
  const extension = mapper?.map(object)
  return new ProblemDocument(document, extension)
}
