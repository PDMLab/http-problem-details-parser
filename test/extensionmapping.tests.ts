import { ProblemDocument, ProblemDocumentExtension } from 'http-problem-details'
import should from 'should'
import { fromObject, HttpProblemExtensionMapper, mapExtensions } from '../src'
import status400 from './json/status-400.json'
import status404 from './json/status-404.json'

type Override<T1, T2> = Omit<T1, keyof T2> & T2

type ValidationProblemDocument = Override<
  ProblemDocument,
  {
    type: 'https://example.net/validation-error'
    'invalid-params': {
      name: string
      reason: string
    }[]
  }
>

type NotFoundProblemDocument = Override<
  ProblemDocument,
  {
    status: 404
    type: 'https://example.net/not-found'
  }
>

type Problem = ValidationProblemDocument | NotFoundProblemDocument

function isValidationProblemDocument(
  value: unknown
): value is ValidationProblemDocument {
  const x = value as ProblemDocument
  return x.type === 'https://example.net/validation-error'
}

const mappers: HttpProblemExtensionMapper[] = [
  {
    type: 'https://example.net/validation-error',
    map: (object: any) =>
      new ProblemDocumentExtension({
        'invalid-params': object['invalid-params']
      })
  }
]

describe('mapExtensions', (): void => {
  describe('when object contains extensions', (): void => {
    const document = fromObject(status400)
    const result = mapExtensions(status400, document, mappers)
    it('should map them as extension', (done) => {
      should.exist(result['invalid-params'])
      done()
    })
  })
})

describe('type guard', (): void => {
  describe('should work', (): void => {
    const document = fromObject(status400, mappers)
    it('should ', (done) => {
      if (isValidationProblemDocument(document)) {
        document['invalid-params'].length.should.equal(2)
      }
      done()
    })
  })
})

describe('discriminated union', (): void => {
  describe('should provide extension properties on validation error', (): void => {
    it('should provide extension properties', (done) => {
      const document = fromObject(status400, mappers) as Problem
      switch (document.type) {
        case 'https://example.net/validation-error':
          document['invalid-params'].length.should.equal(2)
          break
        case 'https://example.net/not-found':
          should.not.exist(document['invalid-params'])
          break

        default:
          break
      }

      done()
    })
    it('should not provide extension properties on 404 error', (done) => {
      const document = fromObject(status404, mappers) as Problem
      switch (document.type) {
        case 'https://example.net/validation-error':
          document['invalid-params'].length.should.equal(2)
          break
        case 'https://example.net/not-found':
          should.not.exist(document['invalid-params'])
          break

        default:
          break
      }

      done()
    })
  })
})
