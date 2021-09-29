import 'should'

import { fromJSON } from '../src'
import status400 from './json/status-400.json'

const status400JSON = JSON.stringify(status400)
describe('fromJSON', (): void => {
  describe('when parsing a problem document from json', (): void => {
    const result = fromJSON(status400JSON)

    it('should contain status', (done) => {
      result.status.should.equal(400)
      done()
    })

    it('should contain title', (done) => {
      result.title.should.equal(`Your request parameters didn't validate.`)
      done()
    })

    it('should contain instance', (done) => {
      result.instance?.should.equal(`https://example.net/account/logs/123`)
      done()
    })
  })
})
