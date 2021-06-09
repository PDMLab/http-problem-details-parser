import { ProblemDocument, ProblemDocumentExtension } from 'http-problem-details'
import should from 'should'
import { fromObject, HttpProblemExtensionMapper, mapExtensions } from '../src'
import status400 from './json/status-400.json'

// Idee: Type Guard + Typ vom ProblemDocument type

type ValidationProblemDocument = ProblemDocument & {
  'invalid-params': {
    name: string
    reason: string
  }[]
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
