# http-problem-details-parser

Based on `http-problem-details` ([repository](https://github.com/PDMLab/http-problem-details) | [npm](https://www.npmjs.com/package/http-problem-details)) , this library allows you to map your HTTP problem details according to [RFC7807](https://tools.ietf.org/html/rfc7807) by convention in a JavaScript / TypeScript client.

## Installation

```bash
npm install http-problem-details-parser
```

or

```bash
yarn add http-problem-details-parser
```

## Usage

Given have a HTTP Problem respons like this:

```json
{
  "type": "https://example.net/not-found",
  "status": 404,
  "title": "Customer not found."
}
```

You can now simply parse it to a `ProblemDocument` document like this:

```typescript
import { fromJSON } from 'http-problem-details-parser'
const result = fromJSON(status400JSON)
```

`http-problem-details-parser` also supports mapping extensions. Given you have this response:

```json
{
  "type": "https://example.net/validation-error",
  "status": 400,
  "title": "Your request parameters didn't validate.",
  "instance": "https://example.net/account/logs/123",
  "invalid-params": [
    {
      "name": "age",
      "reason": "must be a positive integer"
    },
    {
      "name": "color",
      "reason": "must be 'green', 'red' or 'blue'"
    }
  ]
}
```

You can now specify a mapper to map the extension `invalid-params`:

```typescript
const mappers: HttpProblemExtensionMapper[] = [
  {
    type: 'https://example.net/validation-error',
    map: (object: any) =>
      new ProblemDocumentExtension({
        'invalid-params': object['invalid-params']
      })
  }
]
```

when calling `fromJSON(status400JSON, mappers)`, the `invalid-params` extension gets parsed as well.

If you want to handle the `ProblemDocument` instances created above later on, it is recommended to create types for them.

```typescript
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
```

Now you can use type guards or exhaustive pattern matching in TypeScript like this:

```typescript
// type guard
function isValidationProblemDocument(
  value: unknown
): value is ValidationProblemDocument {
  const x = value as ProblemDocument
  return x.type === 'https://example.net/validation-error'
}

// pattern matching
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
```

In addition, you get code completion support for your editor.

## Running the tests

```bash
npm test
```

or

```bash
yarn test
```

## Want to help?

This project is just getting off the ground and could use some help with cleaning things up and refactoring.

If you want to contribute - we'd love it! Just open an issue to work against so you get full credit for your fork. You can open the issue first so we can discuss and you can work your fork as we go along.

If you see a bug, please be so kind as to show how it's failing, and we'll do our best to get it fixed quickly.

Before sending a PR, please [create an issue](https://github.com/PDMLab/http-problem-details-parser/issues/new) to introduce your idea and have a reference for your PR.

We're using [conventional commits](https://www.conventionalcommits.org), so please use it for your commits as well.

Also please add tests and make sure to run `npm run lint-ts` or `yarn lint-ts`.

## License

MIT License

Copyright (c) 2021 PDMLab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
