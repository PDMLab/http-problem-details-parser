import { ProblemDocument, ProblemDocumentExtension } from 'http-problem-details'

export const fromObject = (
  object: any,
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
): ProblemDocument => fromObject(JSON.parse(json))

export type HttpProblemExtensionMapper = {
  type: string
  map: (object: any) => ProblemDocumentExtension
}

export const mapExtensions = (
  object: any,
  document: ProblemDocument,
  mappers: HttpProblemExtensionMapper[]
): ProblemDocument => {
  const mapper = mappers.find((m) => m.type === document.type)
  const extension = mapper?.map(object)
  return new ProblemDocument(document, extension!)
}
